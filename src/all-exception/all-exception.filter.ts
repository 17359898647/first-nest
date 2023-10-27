import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import * as monent from 'monent'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus() || 500
    const { message, code } = exception.getResponse() as any
    response.status(status).json({
      code: code || status,
      timestamp: monent().format('YYYY-MM-DD HH:mm:ss'),
      path: request.url,
      error: 'Bad Request',
      message: message || '请求失败',
    })
  }
}
