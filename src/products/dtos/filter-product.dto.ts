export class FilterProductDTO {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  orderBy?: 'created_at' | 'min_price' | 'max_price';
}
