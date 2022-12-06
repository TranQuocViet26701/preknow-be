import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUser(email);

    if (!user) return null;

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) return null;

    return user;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
      roles: user.roles,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async me(userId: string) {
    const user = await this.userService.findById(userId);

    return user;
  }
}
