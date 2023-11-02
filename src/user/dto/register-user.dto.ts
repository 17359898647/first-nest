import { IsBoolean, IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({
    message: 'username不能为空',
  })
  username: string

  @ApiProperty({ description: '昵称' })
  @IsNotEmpty({
    message: 'nickName不能为空',
  })
  nickName: string

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({
    message: 'password不能为空',
  })
  @MinLength(6, {
    message: 'password长度不能小于6位',
  })
  password: string

  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty({
    message: 'email不能为空',
  })
  @IsEmail({}, {
    message: 'email格式不正确',
  })
  email: string

  @ApiProperty({ description: '验证码' })
  @IsNotEmpty({
    message: 'captcha不能为空',
  })
  captcha: string

  @ApiProperty({ description: '是否管理员' })
  @IsBoolean({
    message: 'isAdmin必须为布尔值',
  })
  isAdmin: boolean
}
