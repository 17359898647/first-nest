import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'

export class LoginUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({
    message: 'username不能为空',
  })
  readonly username: string

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({
    message: 'password不能为空',
  })
  @IsString({
    message: 'password必须为字符串',
  })
  readonly password: string
}
