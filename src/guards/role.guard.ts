import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    //analyse everything that was override, in this case the Role decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log({ requiredRoles });

    if (!requiredRoles) {
      console.log({ requiredRoles });
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const checkRole = requiredRoles.filter((role) => role == user.role);
    console.log(checkRole);
    return checkRole.length > 0;
  }
}
