import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RedisService } from '../redis/redis.service'
import { md5 } from '../utils/md5'
import { UserEntity } from './entities'
import { RegisterUserDto } from './dto/register-user.dto'

@Injectable()
export class UserService {
  private logger = new Logger()
  @InjectRepository(UserEntity)
  private userRepository: Repository<UserEntity>

  @Inject(RedisService)
  private redisService: RedisService

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
    const newUser = new UserEntity()
    newUser.username = registerUser.username
    newUser.password = md5(registerUser.password)
    newUser.email = registerUser.email
    newUser.nickName = registerUser.nickName
    try {
      await this.userRepository.save(newUser)
      return '注册成功'
    }
    catch (e) {
      this.logger.error(e, UserService)
      return '注册失败'
    }
  }
}
