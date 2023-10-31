import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { Request } from 'express'

@Injectable()
export class LogTimesInterceptor implements NestInterceptor {
  private logger = new Logger()
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now()
    const className = context.getClass().name
    const handlerName = context.getHandler().name
    const request = context.switchToHttp().getRequest<Request>()
    const { method, path } = request
    return next
      .handle()
      .pipe(
        tap((data) => {
          this.logger.debug(
              `${method} ${path}  ${className} ${handlerName} ${Date.now() - now}ms`,
          )
          this.logger.debug(
                `request body: ${JSON.stringify(data)}`,
          )
        }),
      )
  }
}
