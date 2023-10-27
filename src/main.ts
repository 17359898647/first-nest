import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { LogTimesInterceptor } from './log-times/log-times.interceptor'
import { TransformDataInterceptor } from './transform-data/transform-data.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // 端口
  app.useGlobalPipes(new ValidationPipe())

  const configService = app.get(ConfigService)
  const port = configService.get('nest_server_port')
  app.useGlobalInterceptors(new LogTimesInterceptor(), new TransformDataInterceptor())
  await app.listen(port)
  console.log(`http://localhost:${port}`)
}
bootstrap()
