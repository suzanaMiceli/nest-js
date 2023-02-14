import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ParamId } from 'src/decorators/param-id.decorator';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UserDTO } from './dto/user.dto';
import { IUser } from './interface/user.interface';
import { UserService } from './user.service';

@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async list(): Promise<IUser[]> {
    return this.userService.list();
  }

  @Get(':id')
  async show(@ParamId() id: number): Promise<IUser> {
    console.log({ id });
    return this.userService.show(id);
  }

  @Put(':id')
  async update(
    @Body() body: UpdatePutUserDTO,
    @ParamId() id: number,
  ): Promise<UserDTO> {
    return this.userService.update(id, body);
  }

  @Patch(':id')
  async updatePartial(
    @Body() body: UpdatePatchUserDTO,
    @ParamId() id: number,
  ): Promise<UserDTO> {
    return this.userService.updatePartial(id, body);
  }
  @Post()
  async create(@Body() data: UserDTO) {
    return this.userService.create(data);
  }
  @Delete(':id')
  async delete(@ParamId() id: number) {
    return this.userService.delete(id);
  }
}
