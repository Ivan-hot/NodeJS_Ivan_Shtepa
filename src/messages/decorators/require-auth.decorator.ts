import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const RequireAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      console.log('No user found in request');
      throw new UnauthorizedException('User not authorized');
    }
    return user;
  },
);
