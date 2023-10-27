import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'
import * as dayjs from 'dayjs'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus() || 500
    const message = exception.getResponse() as any
    console.log(exception.getResponse())
    response.status(status).json({
      code: status,
      path: request.url,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      error: 'Bad Request',
      message: message || '请求失败',
    })
  }
}
