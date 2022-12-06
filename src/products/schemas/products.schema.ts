import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';
import { Shop } from '../../shops/schemas/shop.schema';
import { Variation } from '../interfaces/variation.interface';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  author: string;

  @Prop()
  manufacturer: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' })
  shop: Shop;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  oldPrice: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category;

  @Prop()
  category_slug: string;

  @Prop()
  quantity: number;

  @Prop()
  imageUrl: string;

  @Prop(
    raw({
      conditions: {
        type: [
          {
            name: String,
          },
        ],
      },
      bookCovers: {
        type: [{ name: String }],
      },
    }),
  )
  variations: Variation;

  @Prop()
  numberOfPage: number;

  @Prop()
  manufacture_at: string;

  @Prop()
  dimension: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({
  name: 'text',
  description: 'text',
  category_slug: 'text',
});
