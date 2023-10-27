import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

import { PermissionEntity } from './permission.entity'

@Entity({
  name: 'roles',
})
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 20,
    comment: '角色名',
  })
  name: string

  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: 'role_permission',
  })
    permissions: PermissionEntity[]
}
