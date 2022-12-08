import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { PaymentMethod } from '../enums/payment-method.enum';
import { Item } from '../interfaces/item.interface';

export type OrderDocument = Order & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  userId: string;

  @Prop()
  transactionId: string;

  @Prop()
  items: Item[];

  @Prop()
  paymentMethod: PaymentMethod;

  @Prop()
  amount: number;

  @Prop()
  createdAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
