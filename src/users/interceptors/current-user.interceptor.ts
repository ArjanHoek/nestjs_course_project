import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { NotFoundError, Observable } from 'rxjs';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userId = request.session?.userId;

    if (userId) {
      try {
        const user = await this.usersService.findOneById(userId);
        request.currentUser = user;
      } catch (err) {
        if (err instanceof NotFoundError) {
          request.session.userId = null;
        }
      }
    }

    return next.handle();
  }
}
