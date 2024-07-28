import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Serialize<UserDto>(UserDto)
  @Post('signup')
  public createUser(@Body() { email, password }: CreateUserDto) {
    return this.authService.signup(email, password);
  }

  @Serialize(UserDto)
  @Post('signin')
  public signIn(@Body() { email, password }: CreateUserDto) {
    return this.authService.signin(email, password);
  }

  @Serialize<UserDto>(UserDto)
  @Get(':id')
  public findUser(@Param('id') id: string) {
    return this.usersService.findOneBy({ id });
  }

  @Serialize<UserDto>(UserDto)
  @Get()
  public find(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch(':id')
  public update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  public delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
