import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { random } from 'lodash'
import { RedisService } from '../redis/redis.service'
import { EmailService } from '../email/email.service'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
  ) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    // return await this.userService.register(registerUser)
    return '注册成功'
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = random(true).toString().slice(-6)
    console.log('code', code)
    await this.redisService.set(`captcha_${address}`, code, 5 * 60)
    await this.emailService.sendMail(
      address,
      '验证码',
        `<p>您的验证码是：${code}</p>`,
    )
    return '发送成功'
  }
}
