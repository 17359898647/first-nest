import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, map } from 'rxjs'
import { isUndefined } from 'lodash'

@Injectable()
export class TransformDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const code = context.switchToHttp().getResponse().statusCode
    return next
      .handle()
      .pipe(map(data =>
        ({
          data: isUndefined(data) ? null : data,
          code,
          msg: '请求成功',
        })),
      )
  }
}
