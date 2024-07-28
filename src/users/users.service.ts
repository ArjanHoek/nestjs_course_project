import * as argon from 'argon2';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  public async create({ email, password }: CreateUserDto) {
    return await this.repo.save(
      this.repo.create({
        email,
        hash: await argon.hash(password),
      }),
    );
  }

  public async findOne(id: string) {
    const user = await this.repo.findOne({
      where: { id },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  public find(email: string = '') {
    return this.repo.find({
      where: { email },
      select: { id: true, email: true },
    });
  }

  public async update(id: string, { password, ...dto }: UpdateUserDto) {
    const partialUser: Partial<User> = { ...dto };

    if (password) {
      partialUser.hash = await argon.hash(password);
    }

    return this.repo.update(id, partialUser);
  }

  public delete(id: string) {
    return this.repo.delete(id);
  }
}
