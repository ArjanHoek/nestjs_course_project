import * as argon from 'argon2';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  public async create(email: string, hash: string) {
    const newUser = this.repo.create({ email, hash });

    try {
      return await this.repo.save(newUser);
    } catch (error) {
      throw new BadRequestException('Email already in use');
    }
  }

  public async findOneBy(where: FindOptionsWhere<User>) {
    const user = await this.repo.findOne({
      where,
      select: { id: true, email: true, hash: true },
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
