import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { PaymentMethod } from '../enums/payment-method.enum';

export type OrderDocument = Order & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Cart' })
  cart: string;

  @Prop()
  paymentMethod: PaymentMethod;

  @Prop()
  contactNumber: string;

  @Prop()
  shippingAddress: string;

  @Prop()
  createdAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
