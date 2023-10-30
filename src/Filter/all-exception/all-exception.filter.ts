import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import dayjs from 'dayjs'
import { Request, Response } from 'express'
import { isString } from 'lodash'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name)
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    try {
      const status = exception?.getStatus() || 500
      const message = exception.getResponse()
      response.status(status).json({
        code: status,
        path: request.url,
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        error: 'Bad Request',
        message: message || '请求失败',
      })
    }
    catch (e) {
      this.logger.error(exception.message)
      response.status(500).json({
        code: 500,
        path: request.url,
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        error: exception,
        message: isString(exception.message) ? exception.message : '请求失败',
      })
    }
  }
}
