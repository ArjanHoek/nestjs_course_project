import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const usersServiceMock: Partial<UsersService> = {
  create: (email: string) => Promise.resolve({ id: '3', email, hash: 'test' }),
  findOneByEmail: () => {
    throw new NotFoundException();
  },
};

const createService = async () =>
  (
    await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile()
  ).get(AuthService);

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
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
    jest.spyOn(usersServiceMock, 'create').mockImplementationOnce(() => {
      throw new BadRequestException('Email already in use');
    });

    await expect(service.signup('test@test.com', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('test@test.com', 'password')).rejects.toThrow(
      NotFoundException,
    );
  });
});
