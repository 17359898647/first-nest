import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { LogTimesInterceptor } from './Interceptor/log-times/log-times.interceptor'
import { TransformDataInterceptor } from './Interceptor/transform-data/transform-data.interceptor'
import { AllExceptionFilter } from './Filter/all-exception/all-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('端口')
  // 端口
  app.useGlobalPipes(new ValidationPipe())

  const configService = app.get(ConfigService)
  const port = configService.get('nest_server_port')
  app.useGlobalInterceptors(new LogTimesInterceptor(), new TransformDataInterceptor())
  app.useGlobalFilters(new AllExceptionFilter())
  app.enableCors()
  await app.listen(port)
  logger.log(`http://localhost:${port}`)
}
bootstrap()
