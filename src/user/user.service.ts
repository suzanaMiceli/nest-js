import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UserDTO } from './dto/user.dto';
import { IUser } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: UserDTO) {
    return this.prisma.user.create({
      data: data,
    });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async show(id: number): Promise<IUser> {
    await this.exists(id);
    return this.prisma.user.findUnique({
      where: { id: id },
    });
  }
  async findByEmail(email: string): Promise<IUser> {
    return this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  }

  async update(id: number, data: UpdatePutUserDTO) {
    await this.exists(id);
    return this.prisma.user.update({
      data: data,
      where: { id: id },
    });
  }
  async updatePartial(id: number, data: UpdatePatchUserDTO) {
    await this.exists(id);
    return this.prisma.user.update({
      data: data,
      where: { id: id },
    });
  }
  async delete(id: number) {
    await this.exists(id);
    return this.prisma.user.delete({
      where: { id: id },
    });
  }

  async exists(id: number) {
    const findUser = await this.prisma.user.count({
      where: { id: id },
    });
    if (!findUser) {
      throw new NotFoundException(`O usuário ${id} não exite`);
    }
  }
}
