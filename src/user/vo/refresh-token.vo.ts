import { PickType } from '@nestjs/swagger'
import { LoginUserVo } from './login-user.vo'

export class RefreshTokenVo extends PickType(LoginUserVo, ['accessToken', 'refreshToken']) {
}
