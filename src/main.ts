import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // 端口
  const port = 3000
  await app.listen(port)
  console.log(`http://localhost:${port}`)
}
bootstrap()
