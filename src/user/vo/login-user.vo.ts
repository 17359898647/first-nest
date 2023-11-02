import { ApiProperty } from '@nestjs/swagger'
import { Permission, Roles } from '../entities'

export interface UserInfo {
  userId: number

  username: string

  nickName: string

  email: string

  headPic: string

  phoneNumber: string

  isFrozen: boolean

  isAdmin: boolean

  createTime: number

  roles: Roles['name'][]

  permissions: Permission[]
}
export class LoginUserVo {
  @ApiProperty({ description: '用户信息' })
  userInfo: UserInfo

  @ApiProperty({ description: '访问令牌' })
  accessToken: string

  @ApiProperty({ description: '刷新令牌' })
  refreshToken: string
}
