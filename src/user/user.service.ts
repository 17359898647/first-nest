import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { forEach, indexOf, map, reduce } from 'lodash'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { RedisService } from '../redis/redis.service'
import { md5 } from '../utils/md5'
import { Permission, Roles, Users } from './entities'
import { RegisterUserDto } from './dto/register-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { LoginUserVo } from './vo/login-user.vo'
import { RefreshTokenVo } from './vo/refresh-token.vo'

type PromiseReturnType<T extends (...age: any) => any> = ReturnType<T> extends Promise<infer U> ? U : never
@Injectable()
export class UserService {
  private logger = new Logger()
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Roles)
    private roleRepository: Repository<Roles>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private redisService: RedisService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
  }

  async register(registerUser: RegisterUserDto) {
    const captchaKey = `captcha_${registerUser.email}`
    const captcha = await this.redisService.get(captchaKey)
    if (!captcha)
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST)
    if (captcha !== registerUser.captcha)
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST)
    const foundUser = await this.userRepository.findOneBy({
      username: registerUser.username,
    })
    if (foundUser)
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST)
    const newUser = new Users()
    newUser.username = registerUser.username
    newUser.password = md5(registerUser.password)
    newUser.email = registerUser.email
    newUser.nickName = registerUser.nickName
    newUser.isAdmin = registerUser.isAdmin
    try {
      await this.userRepository.save(newUser)
      return '注册成功'
    }
    catch (e) {
      this.logger.error(e, UserService)
      return '注册失败'
    }
  }

  async initData() {
    const user1 = new Users()
    user1.username = 'zhangsan'
    user1.password = md5('111111')
    user1.email = 'xxx@xx.com'
    user1.isAdmin = true
    user1.nickName = '张三'
    user1.phoneNumber = '13233323333'

    const user2 = new Users()
    user2.username = 'lisi'
    user2.password = md5('222222')
    user2.email = 'yy@yy.com'
    user2.nickName = '李四'

    const role1 = new Roles()
    role1.name = '管理员'

    const role2 = new Roles()
    role2.name = '普通用户'

    const permission1 = new Permission()
    permission1.code = 'ccc'
    permission1.description = '访问 ccc 接口'

    const permission2 = new Permission()
    permission2.code = 'ddd'
    permission2.description = '访问 ddd 接口'

    user1.roles = [role1]
    user2.roles = [role2]

    role1.permissions = [permission1, permission2]
    role2.permissions = [permission1]

    await this.permissionRepository.save([permission1, permission2])
    await this.roleRepository.save([role1, role2])
    await this.userRepository.save([user1, user2])
  }

  createPermissions(roles: Roles[]) {
    return reduce(roles, (acc: Permission[], role) => {
      forEach(role.permissions, (permission) => {
        if (indexOf(acc, permission) === -1)
          acc.push(permission)
      })
      return acc
    }, [])
  }

  async login(loginUserDto: LoginUserDto, isAdmin: boolean = false) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    })
    if (!user)
      throw new HttpException('用户名不存在', HttpStatus.BAD_REQUEST)
    if (user.password !== md5(loginUserDto.password))
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST)
    const userVo = new LoginUserVo()
    userVo.userInfo = {
      ...user,
      userId: user.id,
      createTime: user.createTime.getTime(),
      roles: map(user.roles, role => role.name),
      permissions: this.createPermissions(user.roles),
    }
    const { accessToken, refreshToken } = await this.RefreshToken({
      ...userVo.userInfo,
      id: user.id,
    })
    userVo.accessToken = accessToken
    userVo.refreshToken = refreshToken
    return userVo
  }

  async findUserById(userId: number, isAdmin: boolean = false) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    })
    if (!user)
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)

    return {
      ...user,
      userId: user.id,
      createTime: user.createTime.getTime(),
      roles: map(user.roles, role => role.name),
      permissions: this.createPermissions(user.roles),
    }
  }

  private getAccessToken(userInfo: {
    id: number
    username: string
    roles: string[]
    permissions: Permission[]
  }) {
    return this.jwtService.sign({
      userId: userInfo.id,
      username: userInfo.username,
      roles: userInfo.roles,
      permissions: userInfo.permissions,
    })
  }

  private getRefreshToken(userId: number | string) {
    return this.jwtService.sign({
      userId,
    })
  }

  async RefreshToken(userInfo: {
    id: number
    username: string
    roles: string[]
    permissions: Permission[]
  }) {
    const vo = new RefreshTokenVo()
    vo.accessToken = this.getAccessToken(userInfo)
    vo.refreshToken = this.getRefreshToken(userInfo.id)
    return vo
  }
}
