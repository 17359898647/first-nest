import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class LogTimesInterceptor implements NestInterceptor {
  private logger = new Logger()
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now()
    const path = context.getHandler().name
    const name = context.getClass().name
    return next
      .handle()
      .pipe(
        tap(() => {
          this.logger.log(`${name} ${path} ${Date.now() - now}ms`)
        }),
      )
  }
}
