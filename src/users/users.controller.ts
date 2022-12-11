import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './schemas/users.schema';
import { UpdaterUserDto } from './dtos/update-user';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  async getUsers(): Promise<User[]> {
    const allUsers = this.userService.getAllUsers();
    return allUsers;
  }

  @Get('/:id')
  async getUserById(@Param('id') userId: string): Promise<User> {
    const user = this.userService.findById(userId);
    return user;
  }

  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdaterUserDto,
  ): Promise<User> {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') userId: string) {
    const deletedUser = this.userService.delete(userId);
    return deletedUser;
  }
}
