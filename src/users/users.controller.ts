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

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Serialize<UserDto>(UserDto)
  @Post('signup')
  public createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Serialize<UserDto>(UserDto)
  @Get(':id')
  public findUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
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
