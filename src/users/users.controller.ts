import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Serialize<UserDto>(UserDto)
  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Post('signout')
  public signout(@Session() session: any) {
    session.userId = null;
  }

  @Serialize<UserDto>(UserDto)
  @Post('signup')
  public async signUp(
    @Body() { email, password }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signUp(email, password);
    session.userId = user.id;
    return user;
  }

  @Serialize(UserDto)
  @Post('signin')
  public async signIn(
    @Body() { email, password }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signIn(email, password);
    session.userId = user.id;
    return user;
  }

  @Serialize<UserDto>(UserDto)
  @Get(':id')
  public findUser(@Param('id') id: string) {
    return this.usersService.findOneById(id);
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
