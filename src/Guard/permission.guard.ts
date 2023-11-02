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
import { Request } from 'express'
import { findIndex, forEach } from 'lodash'
import { Permission } from '../user/entities'

@Injectable()
export class PermissionGuard implements CanActivate {
  private logger = new Logger(PermissionGuard.name)
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    if (!request.user)
      return true
    const permissions = request.user.permissions
    const requirePermissions = this.reflector.getAllAndOverride<Permission['code'][]>('require-permissions', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requirePermissions)
      return true
    const errorRequirePermissions: Permission['code'][] = []
    forEach(requirePermissions, (permission) => {
      if (!findIndex(permissions, p => p.code === permission))
        errorRequirePermissions.push(permission)
    })
    if (errorRequirePermissions.length)
      throw new UnauthorizedException(`用户没有权限: ${errorRequirePermissions.join(', ')}`)
    return true
  }
}
export const RequirePermissions = (...permissions: Permission['code'][]) => SetMetadata('require-permissions', permissions)
