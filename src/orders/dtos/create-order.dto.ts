import { PaymentMethod } from '../enums/payment-method.enum';

export class CreateOrderDTO {
  paymentMethod: PaymentMethod;
  contactNumber: string;
  shippingAddress: string;
}
