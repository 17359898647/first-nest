import { SetMetadata } from '@nestjs/common'
import { Permission } from '../user/entities'

export const RequireLogin = (require: boolean = true) => SetMetadata('require-login', require)
export const RequirePermissions = (...permissions: Permission['code'][]) => SetMetadata('require-permissions', permissions)
