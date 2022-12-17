import { CheckoutZalopayDto } from './dtos/checkout.dto';
import { ZALOPAY_CONFIG } from './../config';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/products/products.service';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { Order, OrderDocument } from './schemas/orders.schema';
import * as HmacSHA256 from 'crypto-js/hmac-sha256';
import axios from 'axios';
import * as moment from 'moment';
import { PaymentMethod } from './enums/payment-method.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<OrderDocument>,
  ) {}

  async checkoutZalopay(checkoutZalopayDto: CheckoutZalopayDto) {
    const embed_data = {
      redirecturl:
        process.env.ZALOPAY_REDIRECT_URL ||
        'https://preknow.vercel.app/checkout/finish',
    };

    const order: any = {
      app_id: ZALOPAY_CONFIG.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${
        checkoutZalopayDto.transactionId
      }`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: checkoutZalopayDto.userId,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(checkoutZalopayDto.items),
      embed_data: JSON.stringify(embed_data),
      amount: checkoutZalopayDto.amount,
      description: `PreKnow - Payment for the order #${checkoutZalopayDto.transactionId}`,
      bank_code: 'zalopayapp',
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      ZALOPAY_CONFIG.app_id +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item;

    order.mac = HmacSHA256(data, ZALOPAY_CONFIG.key1).toString();

    const { data: result } = await axios.post(ZALOPAY_CONFIG.endpoint, null, {
      params: order,
    });

    return result;
  }

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDTO,
  ): Promise<any> {
    // TODO: check in stock & user balance
    // const {} = createOrderDto
    // const isOk = this.productService.isInStock()

    const transactionId = Math.floor(Math.random() * 1000000);

    const order = await this.orderModel.create({
      ...createOrderDto,
      transactionId,
      userId,
    });

    // TODO: call Payment Service

    if (createOrderDto.paymentMethod === PaymentMethod.ZALOPAY) {
      const res = await this.checkoutZalopay({
        userId,
        items: order.items,
        amount: order.amount,
        transactionId,
      });

      return {
        ...res,
        data: order,
      };
    }

    return {
      data: order,
    };
  }

  async getUserOrders(userId: string) {
    // TODO: pagination

    const orders = await this.orderModel.find({ userId });
    return orders;
  }

  async getUserOrderById(orderId: string, userId: string) {
    // TODO: create compound index {orderId, userId}
    const order = await this.orderModel.findOne({ _id: orderId, userId });
    return order;
  }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
