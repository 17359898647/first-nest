import { IsBoolean, IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class RegisterUserDto {
  @IsNotEmpty({
    message: 'username不能为空',
  })
  username: string

  @IsNotEmpty({
    message: 'nickName不能为空',
  })
  nickName: string

  @IsNotEmpty({
    message: 'password不能为空',
  })
  @MinLength(6, {
    message: 'password长度不能小于6位',
  })
  password: string

  @IsNotEmpty({
    message: 'email不能为空',
  })
  @IsEmail({}, {
    message: 'email格式不正确',
  })
  email: string

  @IsNotEmpty({
    message: 'captcha不能为空',
  })
  captcha: string

  @IsBoolean({
    message: 'isAdmin必须为布尔值',
  })
  isAdmin: boolean
}
