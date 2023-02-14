import { PartialType } from '@nestjs/mapped-types';
import { UserDTO } from './user.dto';

export class UpdatePatchUserDTO extends PartialType(UserDTO) {}
