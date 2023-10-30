import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsString } from 'class-validator'
import { CreateUserDto } from './create-user.dto'

export class LoginUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({
    message: 'username不能为空',
  })
  readonly username: string

  @IsNotEmpty({
    message: 'password不能为空',
  })
  @IsString({
    message: 'password必须为字符串',
  })
  readonly password: string
}
