import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { split } from 'lodash'
import { UserInfo } from '../user/vo/login-user.vo'

interface JwtUserData extends Pick<UserInfo, 'username' | 'roles' | 'permissions' | 'userId'> {
}
declare module 'express'{
  interface Request {
    user: JwtUserData
  }
}
@Injectable()
export class LoginGuard implements CanActivate {
  private logger = new Logger(LoginGuard.name)
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const requireLogin = this.reflector.getAllAndOverride<boolean>('require-login', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requireLogin)
      return true
    const [_, authorization] = split(request.headers.authorization, ' ')
    if (!authorization)
      throw new UnauthorizedException('用户未登录')
    try {
      request.user = this.jwtService.verify<JwtUserData>(authorization)
      return true
    }
    catch (e) {
      let message = ''
      switch (e.name) {
        case 'TokenExpiredError':
          message = '登录已过期，请重新登录'
          break
        case 'JsonWebTokenError':
          message = '登录凭证错误，请重新登录'
          break
        default:
          message = `内部错误:${e.message}`
      }
      this.logger.error(message)
      throw new UnauthorizedException(message)
    }
  }
}
export const RequireLogin = (require: boolean = true) => SetMetadata('require-login', require)
