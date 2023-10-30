import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
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
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requireLogin)
      return true
    const authorization = request.headers.authorization
    if (!authorization)
      throw new UnauthorizedException('用户未登录')
    try {
      request.user = this.jwtService.verify<JwtUserData>(authorization)
      return true
    }
    catch (e) {
      throw new UnauthorizedException('用户未登录')
    }
  }
}
