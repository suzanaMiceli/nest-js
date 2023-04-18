import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { UpdatePutUserDTO } from '../src/user/dto/update-put-user.dto';
import { NotFoundException } from '@nestjs/common';

const fakeUsers: any = [
  {
    id: 1,
    name: 'John Doe',
    email: 'doe@email.com',
    password: '123456',
    active: true,
  },
  {
    id: 2,
    name: 'Renata Doe',
    email: 'renata@email.com',
    password: '123456',
    active: true,
  },
  {
    id: 1,
    name: 'Mary Doe',
    email: 'mary@email.com',
    password: '123456',
    active: true,
  },
];

const prismaMock = {
  user: {
    create: jest.fn().mockReturnValue(fakeUsers[0]),
    findMany: jest.fn().mockResolvedValue(fakeUsers),
    findUnique: jest.fn().mockResolvedValue(fakeUsers[0]),
    update: jest.fn().mockResolvedValue(fakeUsers[0]),
    delete: jest.fn(),
    count: jest.fn().mockResolvedValue(fakeUsers[0]),
  },
};

describe('UserService', () => {
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array o posts', async () => {
      const response = await userService.list();

      expect(response).toEqual(fakeUsers);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const response = await userService.show(1);

      expect(response).toEqual(fakeUsers[0]);
      expect(prisma.user.findUnique).toBeCalledTimes(1);
      expect(prisma.user.findUnique).toBeCalledWith({
        where: { id: 1 },
      });
      expect(prisma.user.count).toBeCalledWith({
        where: { id: 1 },
      });
    });
    it(`should return nothing when user is not found`, async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(undefined);
      const response = await userService.show(40);

      expect(response).toBeUndefined();
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 40 },
      });
    });
  });
  describe('create', () => {
    it(`should create a new user`, async () => {
      const response = await userService.create(fakeUsers[0]);

      expect(response).toBe(fakeUsers[0]);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: fakeUsers[0],
      });
    });
  });

  describe('updateOne', () => {
    it(`should update a user`, async () => {
      const response = await userService.update(1, fakeUsers[0]);

      expect(response).toEqual(fakeUsers[0]);
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: fakeUsers[0],
      });
    });

    it(`should return NotFoundException when no user is found`, async () => {
      const unexistingUser: UpdatePutUserDTO = {
        name: 'Jenny Doe',
        email: 'doe@email.com',
        password: '123456',
        active: true,
        birthAt: '',
        role: 0,
      };

      jest
        .spyOn(prisma.user, 'update')
        .mockRejectedValue(new NotFoundException());

      try {
        await userService.update(42, unexistingUser);
      } catch (error) {
        expect(error).toEqual(new NotFoundException());
      }

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 42 },
        data: unexistingUser,
      });
    });
  });

  describe('deleteOne', () => {
    it(`should delete a user and return empty body`, async () => {
      expect(await userService.delete(1)).toBeUndefined();
      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it(`should return NotFoundException if user does not exist`, async () => {
      jest
        .spyOn(prisma.user, 'delete')
        .mockRejectedValue(new NotFoundException());

      try {
        await userService.delete(99);
      } catch (error) {
        expect(error).toEqual(new NotFoundException());
      }

      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 99 },
      });
    });
  });
});
