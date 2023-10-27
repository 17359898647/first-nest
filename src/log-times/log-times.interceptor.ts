import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class LogTimesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now()
    const path = context.getHandler().name
    const name = context.getClass().name
    return next
      .handle()
      .pipe(
        tap(() => {
          console.log(`${name} ${path} ${Date.now() - now}ms`)
        }),
      )
  }
}
