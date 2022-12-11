import { UpdaterUserDto } from './dtos/update-user';
import { ConflictException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDTO } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const user = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (user) throw new ConflictException('This account already existed!');

    const newUser = await this.userModel.create(createUserDto);
    if (createUserDto.password)
      newUser.password = await bcrypt.hash(newUser.password, 10);
    return newUser.save();
  }

  async findUser(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().select(['-password']);
    return users;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select(['-password']);
    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdaterUserDto,
  ): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
    );
    return updatedUser;
  }

  async delete(id: string) {
    const deletedUser = await this.userModel
      .findByIdAndDelete(id)
      .select(['-password']);
    return deletedUser;
  }
}
