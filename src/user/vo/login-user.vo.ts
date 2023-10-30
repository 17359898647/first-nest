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
  userInfo: UserInfo

  accessToken: string

  refreshToken: string
}
