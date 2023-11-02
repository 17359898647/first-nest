import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { random } from 'lodash'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RedisService } from '../redis/redis.service'
import { EmailService } from '../email/email.service'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { LoginUserVo } from './vo/login-user.vo'
import { RefreshTokenVo } from './vo/refresh-token.vo'

@Controller('user')
@ApiTags('用户')
export class UserController {
  private logger = new Logger(UserController.name)
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser)
  }

  @Get('register-captcha')
  @ApiOperation({ summary: '注册验证码' })
  @ApiQuery({ name: 'address', description: '邮箱地址' })
  async captcha(@Query('address') address: string) {
    const code = random(true).toString().slice(-6)
    this.logger.debug(`验证码：${code}`)
    await this.redisService.set(`captcha_${address}`, code, 5 * 60)
    await this.emailService.sendMail(
      address,
      '验证码',
        `<p>您的验证码是：${code}</p>`,
    )
    return '发送成功'
  }

  @Get('init-data')
  async initData() {
    await this.userService.initData()
    return '初始化成功'
  }

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiBody({
    type: LoginUserVo,
  })
  async login(@Body() loginUser: LoginUserDto) {
    return await this.userService.login(loginUser)
  }

  @Post('/admin/login')
  @ApiOperation({ summary: '管理员登录' })
  async adminLogin(@Body() loginUser: LoginUserDto) {
    return await this.userService.login(loginUser, true)
  }

  @Get('refresh')
  @ApiOperation({ summary: '刷新token' })
  @ApiQuery({ name: 'token', description: 'token' })
  @ApiBody({
    type: RefreshTokenVo,
  })
  async refresh(@Query('token') token: string) {
    try {
      const data = this.jwtService.verify(token)
      const user = await this.userService.findUserById(data.userId)
      return await this.userService.RefreshToken(user)
    }
    catch (e) {
      this.logger.error(e.message)
      throw new UnauthorizedException(e)
    }
  }

  @Get('/admin/refresh')
  @ApiOperation({ summary: '刷新管理员token' })
  @ApiQuery({ name: 'token', description: 'token' })
  async adminRefresh(@Query('token') token: string) {
    try {
      const data = this.jwtService.verify(token)
      const user = await this.userService.findUserById(data.userId, true)
      const { refreshToken, accessToken } = await this.userService.RefreshToken(user)
      return {
        accessToken,
        refreshToken,
      }
    }
    catch (e) {
      throw new UnauthorizedException('token过期 请重新登录')
    }
  }

  @Post('update')
  @ApiOperation({ summary: '更新用户信息' })
  async update(@Body() registerUser: RegisterUserDto) {
    return '更新成功'
  }

  @Post('update-password')
  @ApiOperation({ summary: '更新用户密码' })
  async updatePassword(@Body() registerUser: RegisterUserDto) {
    return '更新成功'
  }

  @Post('/admin/update')
  @ApiOperation({ summary: '更新管理员信息' })
  async adminUpdate(@Body() registerUser: RegisterUserDto) {
    return '更新成功'
  }

  @Post('/admin/update-password')
  @ApiOperation({ summary: '更新管理员密码' })
  async adminUpdatePassword(@Body() registerUser: RegisterUserDto) {
    return '更新成功'
  }
}
