import { PaymentMethod } from '../enums/payment-method.enum';
import { Item } from '../interfaces/item.interface';

export class CreateOrderDTO {
  items: Item[];
  amount: number;
  paymentMethod: PaymentMethod;
}
