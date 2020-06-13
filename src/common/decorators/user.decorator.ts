import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator((key, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return user ? user[key] : null;
})
