import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { find, forEach } from 'lodash'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
      @Inject(Reflector) private readonly reflector: Reflector,
  ) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    if (!request.user)
      return true
    const permissions = request.user.permissions
    const requirePermissions = this.reflector.getAllAndOverride<string[]>('require-permissions', [
      context.getHandler(),
      context.getClass(),
    ])
    console.log('permissions', permissions, requirePermissions)
    if (!requirePermissions)
      return true
    forEach(requirePermissions, (permission) => {
      const found = find(permissions, p => p.code === permission)
      if (!found)
        throw new UnauthorizedException(`权限不足，缺少${permission}权限`)
    })
    return true
  }
}
