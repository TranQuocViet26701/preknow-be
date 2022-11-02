import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product' })
  productId: string;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop()
  subTotalPrice: number;

  @Prop()
  imageUrl: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
