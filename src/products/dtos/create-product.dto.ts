import { Variation } from './../interfaces/variation.interface';
export class CreateProductDTO {
  name: string;
  author: string;
  manufacturer: string;
  shop: string;
  description: string;
  price: number;
  oldPrice: number;
  category_slug: string;
  quantity: number;
  imageUrl: string;
  variations: Variation;
  numberOfPage: number;
  manufacture_at: string;
  dimension: string;
}
