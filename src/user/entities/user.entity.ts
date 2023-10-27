import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { RoleEntity } from './role.entity'

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column({
    length: 50,
    comment: '用户名',
  })
    username: string

  @Column({
    length: 50,
    comment: '密码',
  })
    password: string

  @Column({
    length: 50,
    comment: '昵称',
    name: 'nick_name',
  })
    nickName: string

  @Column({
    length: 50,
    comment: '邮箱',
  })
    email: string

  @Column({
    length: 50,
    comment: '头像',
    nullable: true,
  })
    headPic: string

  @Column({
    length: 20,
    comment: '手机号',
    nullable: true,
  })
    phoneNumber: string

  @Column({
    comment: '是否冻结',
    default: false,
  })
  isFrozen: boolean

  @Column({
    comment: '是否管理员',
    default: false,
  })
  isAdmin: boolean

  @CreateDateColumn()
  updateTime: Date

  @ManyToMany(() => RoleEntity)
  @JoinTable({
    name: 'user_role',
  })
    roles: RoleEntity[]
}
