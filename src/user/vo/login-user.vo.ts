import { ApiProperty } from '@nestjs/swagger'
import { Permission, Roles } from '../entities'

export class UserInfo {
  @ApiProperty({ description: '用户id' })
    userId: number

  @ApiProperty({ description: '用户名' })
    username: string

  @ApiProperty({ description: '昵称' })
    nickName: string

  @ApiProperty({ description: '邮箱' })
    email: string

  @ApiProperty({ description: '头像' })
    headPic: string

  @ApiProperty({ description: '手机号' })
    phoneNumber: string

  @ApiProperty({ description: '是否冻结' })
    isFrozen: boolean

  @ApiProperty({ description: '是否管理员' })
    isAdmin: boolean

  @ApiProperty({ description: '创建时间' })
    createTime: number

  @ApiProperty({ description: '角色' })
    roles: Roles['name'][]

  @ApiProperty({ description: '权限' })
    permissions: Permission[]
}
export class LoginUserVo {
  @ApiProperty({
    description: '用户信息',
    type: UserInfo,
  })
  userInfo: UserInfo

  @ApiProperty({ description: '访问令牌' })
  accessToken: string

  @ApiProperty({ description: '刷新令牌' })
  refreshToken: string
}
