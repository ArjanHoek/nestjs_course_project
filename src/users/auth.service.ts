import * as argon from 'argon2';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  public async signUp(email: string, password: string) {
    return this.usersService.create(email, await argon.hash(password));
  }

  public async signIn(email = '', password: string) {
    const { hash, ...user } = await this.usersService.findOneByEmail(email);

    const isVerfied = await argon.verify(hash, password);

    if (!isVerfied) throw new UnauthorizedException();

    return user;
  }
}
