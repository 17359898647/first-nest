import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { Permission, Roles, Users } from './user/entities'
import { RedisModule } from './redis/redis.module'
import { EmailModule } from './email/email.module'
import { LoginGuard } from './Guard/login.guard'
import { PermissionGuard } from './Guard/permission.guard'

@Module({
  // 声明控制器
  controllers: [AppController],
  // 导入模块
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        /* 数据库连接配置 */
        type: 'mysql', // 数据库类型
        host: configService.get('mysql_server_host'), // 数据库地址
        port: configService.get('mysql_server_port'), // 数据库端口
        username: configService.get('mysql_server_username'), // 数据库用户名
        password: configService.get('mysql_server_password'), // 数据库密码
        database: configService.get('mysql_server_database'), // 数据库名称
        synchronize: true, // 是否自动同步数据库结构
        logging: true, // 是否打印日志
        entities: [ // 实体类
          Roles,
          Permission,
          Users,
        ],
        poolSize: 10, // 连接池大小
        connectorPackage: 'mysql2', // 数据库连接器包名
        extra: {
          /* 额外配置 */
          authPlygin: 'sha256_password', // 认证插件
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt_secret'),
        signOptions: {
          expiresIn: configService.get('jwt_access_token_expires_time') || '30m',
        },
      }),
    }),
    UserModule,
    RedisModule,
    EmailModule,
  ],
  // 声明服务提供者
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
