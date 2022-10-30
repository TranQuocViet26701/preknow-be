import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BookCover } from '../enums/book-cover.enum';
import { Category } from '../enums/category.enum';
import { Condition } from '../enums/condition.enum';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  oldPrice: number;

  @Prop()
  category: Category;

  @Prop()
  author: string;

  @Prop()
  quantity: number;

  @Prop()
  imageUrl: string;

  @Prop()
  condition: Condition;

  @Prop()
  bookCover: BookCover;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
