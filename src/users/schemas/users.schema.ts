import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  bio: string;

  @Prop()
  contact: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  image: string;

  @Prop()
  address: string;

  @Prop()
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
