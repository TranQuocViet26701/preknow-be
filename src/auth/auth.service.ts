import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';
import { SocialLoginDto } from './dto/create-auth.dto';

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

  async socialLogin(socialLoginDto: SocialLoginDto) {
    let payload = null;

    const user = await this.userService.findUser(
      socialLoginDto.user.email as string,
    );

    if (user) {
      payload = {
        email: user.email,
        sub: (user as any)._id,
        roles: user.roles,
      };
    } else {
      const newUser = await this.userService.createUser({
        ...socialLoginDto.user,
        roles: ['user'],
      });

      payload = {
        email: newUser.email,
        sub: (newUser as any)._id,
        roles: newUser.roles,
      };
    }

    return {
      access_token: this.jwtService.sign(payload),
      permissions: payload.roles,
    };
  }

  async me(userId: string) {
    const user = await this.userService.findById(userId);

    return user;
  }
}
