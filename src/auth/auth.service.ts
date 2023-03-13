import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  private audience = 'users';
  private issuer = 'login';
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userServise: UserService,
  ) {}

  createToken(user: User) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const check = this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });
      return check;
    } catch (e) {
      throw new BadRequestException(e.message, e.name);
    }
  }
  async isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email or passoword invalid');
    }
    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Email is invalid');
    }
    //TO DO: send email
    //return true because i just need to send the email...
    return true;
  }

  async reset(password: string, token: string) {
    //TODO: validate token....
    const id = 0; // id from the token
    const user = await this.prisma.user.update({
      where: { id },
      data: { password },
    });
    return this.createToken(user);
  }
  async register(data: AuthRegisterDTO) {
    const findUser = await this.userServise.findByEmail(data.email);
    if (findUser) {
      throw new BadRequestException('This user already exists');
    }
    const user = await this.userServise.create(data);
    return this.createToken(user);
  }
}
