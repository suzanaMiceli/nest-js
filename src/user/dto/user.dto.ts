import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class UserDTO {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  password: string;
  @IsOptional()
  @IsDateString()
  birthAt: string | Date;
  @IsOptional()
  @IsEnum(Role)
  role: number;
  @IsBoolean()
  active: boolean;
}
