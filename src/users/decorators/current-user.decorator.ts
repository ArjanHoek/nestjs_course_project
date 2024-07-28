import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: never, context: ExecutionContext) => {
    const { currentUser } = context.switchToHttp().getRequest();
    return currentUser;
  },
);
