import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

const mockUser: User = {
  id: '3',
  email: 'test@test.com',
  hash: 'test',
};

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  const findOneByIdMockFn = jest.fn(() => Promise.resolve(mockUser as User));

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([mockUser]),
      findOneById: findOneByIdMockFn,
      update: () => Promise.resolve({} as UpdateResult),
      delete: () => Promise.resolve({} as DeleteResult),
    };

    fakeAuthService = {
      signUp: () => Promise.resolve(mockUser as User),
      signIn: () => Promise.resolve(mockUser as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find returns a list of users with the given email', async () => {
    const users = await controller.find(mockUser.email);
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(mockUser.email);
  });

  it('findUser should return single user by given id', async () => {
    const user = await controller.findUser(mockUser.id);
    expect(user).toStrictEqual(mockUser);
  });

  it('findUser throws an error is user with given id is not found', async () => {
    findOneByIdMockFn.mockRejectedValueOnce(new NotFoundException());
    await expect(controller.findUser('3')).rejects.toThrow(NotFoundException);
  });

  it('signIn updates session object and return suser', async () => {
    const session = {};
    const user = await controller.signIn(
      { email: mockUser.email, password: 'password' },
      session,
    );

    expect(user).toStrictEqual(mockUser);
    expect(session).toStrictEqual({ userId: mockUser.id });
  });
});
