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

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return { status: 'success', user };
  }

  @Get(':id')
  public findUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get()
  find(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
