import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable, map } from 'rxjs'
import { isUndefined, startsWith } from 'lodash'
import { Response } from 'express'

@Injectable()
export class TransformDataInterceptor implements NestInterceptor {
  private logger = new Logger(TransformDataInterceptor.name)
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>()
    const url = context.switchToHttp().getRequest().url
    const code = response.statusCode.toString()
    if (startsWith(code, '2'))
      response.status(200)
    this.logger.log(`请求地址：${url}`)
    return next
      .handle()
      .pipe(map((data) => {
        return {
          data: isUndefined(data) ? null : data,
          code: response.statusCode.toString(),
          msg: '请求成功',
        }
      }),
      )
  }
}
