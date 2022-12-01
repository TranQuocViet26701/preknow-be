import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShopDocument = HydratedDocument<Shop>;

@Schema()
export class Shop {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
