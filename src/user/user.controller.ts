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
import { RedisService } from '../redis/redis.service'
import { EmailService } from '../email/email.service'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { LoginUserDto } from './dto/login-user.dto'

@Controller('user')
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
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser)
  }

  @Get('register-captcha')
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
  async login(@Body() loginUser: LoginUserDto) {
    const loginResult = await this.userService.login(loginUser)
    loginResult.accessToken = this.userService.loginSign(loginResult)
    loginResult.refreshToken = this.jwtService.sign({
      userId: loginResult.userInfo.userId,
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expires_time') || '7d',
    })
    return loginResult
  }

  @Post('admin-login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const loginResult = await this.userService.login(loginUser, true)
    loginResult.accessToken = this.userService.loginSign(loginResult)
    loginResult.refreshToken = this.jwtService.sign({
      userId: loginResult.userInfo.userId,
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expires_time') || '7d',
    })
    return loginResult
  }

  @Get('refresh')
  async refresh(@Query('token') token: string) {
    try {
      const data = this.jwtService.verify(token)
      const user = await this.userService.findUserById(data.userId)
      return await this.userService.refreshToken(user)
    }
    catch (e) {
      this.logger.error(e.message)
      throw new UnauthorizedException(e)
    }
  }

  @Get('admin-refresh')
  async adminRefresh(@Query('token') token: string) {
    try {
      const data = this.jwtService.verify(token)
      const user = await this.userService.findUserById(data.userId, true)
      const { refreshToken, accessToken } = await this.userService.refreshToken(user)
      return {
        accessToken,
        refreshToken,
      }
    }
    catch (e) {
      throw new UnauthorizedException('token过期 请重新登录')
    }
  }
}
