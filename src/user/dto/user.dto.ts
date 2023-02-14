import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';

export class UserDTO {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  password: string;
  @IsBoolean()
  active: boolean;
}
