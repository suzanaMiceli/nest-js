import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    try {
      const token = authorization ? authorization.replace('Bearer ', '') : null;
      const payload = this.authService.checkToken(token);
      request.tokenPayload = payload;
      const userData = await this.userService.show(payload.id);

      //create a new attribute named user to request
      request.user = await this.userService.show(payload.id);
      return true;
    } catch (e) {
      return false;
    }
  }
}
