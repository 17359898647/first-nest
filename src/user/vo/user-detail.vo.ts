import { ApiProperty, PickType } from '@nestjs/swagger'
import { UserInfo } from './login-user.vo'

export class UserDetailVo extends PickType(UserInfo, ['username', 'nickName', 'email', 'headPic', 'phoneNumber', 'isFrozen']) {
  @ApiProperty({
    description: '用户id',
  })
    id: number

  @ApiProperty({ description: '创建时间' })
  createTime: string
}
