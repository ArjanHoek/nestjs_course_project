import * as argon from 'argon2';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  public async signup(email: string, password: string) {
    return this.usersService.create(email, await argon.hash(password));
  }

  public async signin(email: string, password: string) {
    const user = await this.usersService.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const isVerfied = await argon.verify(user.hash, password);

    if (!isVerfied) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
