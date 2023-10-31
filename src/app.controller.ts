import { Controller, Get, SetMetadata } from '@nestjs/common'
import { AppService } from './app.service'
import { RequireLogin } from './Guard/login.guard'

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
  // @RequirePermissions('ccc', 'ddd', 'aaa')
  test(): string {
    return 'test'
  }
}
