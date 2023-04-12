import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';
import { ForgetDTO } from './dto/auth-forget.dto';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

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
  @UseGuards(AuthGuard)
  @Post('verify')
  async me(@User() user) {
    return { user: user };
  }
  //to get the file in the body
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 70 }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    const path = join(
      __dirname,
      '..',
      '..',
      'storage',
      'photos',
      `photo-${user.id}.png`,
    );
    try {
      await this.fileService.upload(photo, path);
    } catch (e) {
      throw new BadRequestException(e);
    }
    return { sucess: photo };
  }
}
