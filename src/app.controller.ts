import { Controller, Get, SetMetadata } from '@nestjs/common'
import { AppService } from './app.service'
import { JwtUserData, RequireLogin } from './Guard/login.guard'
import { GetUserInfo } from './Guard/GetUserInfo'

@Controller()
@SetMetadata('require-login', false)
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('test')
  @RequireLogin()
  test(@GetUserInfo() userInfo: JwtUserData): string {
    console.log(userInfo)
    return 'test'
  }
}
