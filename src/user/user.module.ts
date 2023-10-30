import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { Permission, Roles, Users } from './entities'

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([Users, Roles, Permission]),
  ],
})
export class UserModule {}
