import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { Request } from 'express'

@Injectable()
export class LogTimesInterceptor implements NestInterceptor {
  private logger = new Logger(LogTimesInterceptor.name)
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now()
    const className = context.getClass().name
    const handlerName = context.getHandler().name
    const { user, method, path } = context.switchToHttp().getRequest<Request>()
    return next
      .handle()
      .pipe(
        tap((data) => {
          this.logger.debug(
              `userId: ${user.userId} userName: ${user.username} ${method} ${path}  ${className} ${handlerName} ${Date.now() - now}ms`,
          )
          this.logger.debug(
                `request body: ${JSON.stringify(data)}`,
          )
        }),
      )
  }
}
