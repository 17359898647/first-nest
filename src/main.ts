import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // 端口
  const port = 3000
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(port)
  console.log(`http://localhost:${port}`)
}
bootstrap()
