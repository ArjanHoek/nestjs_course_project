import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let users: User[] = [];

  const findOneByEmailMockFn = jest.fn((email: string) => {
    const user = users.find((user) => user.email === email);
    return Promise.resolve(user);
  });

  const createMockFn = jest.fn((email: string, hash: string) => {
    const user = {
      id: `${Math.floor(Math.random() * 99999)}${+new Date()}`,
      email,
      hash,
    };
    users.push(user);
    return Promise.resolve(user);
  });

  const usersServiceMock: Partial<UsersService> = {
    findOneByEmail: findOneByEmailMockFn,
    create: createMockFn,
  };

  const createService = async () =>
    (
      await Test.createTestingModule({
        providers: [
          AuthService,
          { provide: UsersService, useValue: usersServiceMock },
        ],
      }).compile()
    ).get(AuthService);

  beforeEach(async () => {
    users = [];
    service = await createService();
  });

  it('can create an instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a hashed password', async () => {
    const password = 'test123';
    const { hash } = await service.signup('test@test.com', password);
    expect(hash).toBeDefined();
    expect(hash).not.toEqual(password);
  });

  it('throws an error if user signs up with email that is already used', async () => {
    createMockFn.mockRejectedValueOnce(
      new BadRequestException('Email already in use'),
    );

    await expect(service.signup('test@test.com', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    findOneByEmailMockFn.mockRejectedValueOnce(new NotFoundException(''));

    await expect(service.signin('test@test.com', 'correct')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    const userMock = service.signup('test@test.com', 'correct');
    findOneByEmailMockFn.mockReturnValueOnce(userMock);

    await expect(service.signin('test@test.com', 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    const { id, email } = await service.signup('test@test.com', 'correct');

    await expect(
      service.signin('test@test.com', 'correct'),
    ).resolves.toStrictEqual({ id, email });
  });
});
