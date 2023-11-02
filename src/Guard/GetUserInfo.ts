import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'
import { JwtUserData } from './login.guard'

export const GetUserInfo = createParamDecorator<keyof JwtUserData>(
  (data, req: ExecutionContext) => {
    const request = req.switchToHttp().getRequest<Request>()
    if (!request.user)
      return null
    return data ? request.user[data] : request.user
  },
)
