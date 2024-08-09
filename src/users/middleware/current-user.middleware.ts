import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../users.service';
import { NotFoundError } from 'rxjs';
import { User } from '../user.entity';

declare module 'Express' {
  interface Request {
    currentUser?: User;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  public async use(req: Request, _: Response, next: NextFunction) {
    const session = req.session;

    const userId = session?.userId;

    if (userId) {
      try {
        const user = await this.usersService.findOneById(userId);

        req.currentUser = user;
      } catch (err) {
        if (err instanceof NotFoundError) {
          req.session.userId = null;
        }
      }
    }

    next();
  }
}
