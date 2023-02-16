import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { ForgetDTO } from './dto/auth-forget.dto';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    const login = await this.authService.login(email, password);
    return login;
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    const register = await this.authService.register(body);
    return register;
  }

  @Post('forget')
  async forget(@Body() { email }: ForgetDTO) {
    const forget = await this.authService.forget(email);
    return forget;
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    const reset = await this.authService.reset(password, token);
    return reset;
  }
  @Post('me')
  async me(@Body() body) {
    const reset = await this.authService.checkToken(body.token);
    return reset;
  }
}
