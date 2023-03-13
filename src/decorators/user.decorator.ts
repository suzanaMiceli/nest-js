import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const User = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (request.user) {
      if (filter) {
        return request.user[filter];
      }
      return request.user;
    } else {
      throw new NotFoundException(
        'No user found in the request. Check the authGuard',
      );
    }
  },
);
