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

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<OrderDocument>,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
  ) {}

  async checkout() {
    // Node v10.15.3

    // APP INFO
    const config = {
      app_id: '2553',
      key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
      key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
      endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
    };

    const embed_data = {};

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order: any = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: 'user123',
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: 1,
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: 'zalopayapp',
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
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

    console.log('data: ', data);
    order.mac = HmacSHA256(data, config.key1).toString();

    const result = await axios.post(config.endpoint, null, { params: order });

    console.log('result: ', result.data);

    return result.data;
  }

  async createOrder(
    userId: string,
    cartId: string,
    createOrderDto: CreateOrderDTO,
  ): Promise<Order> {
    // TODO: check in stock & user balance
    // const {} = createOrderDto
    // const isOk = this.productService.isInStock()

    const newOrder = await this.orderModel.create({
      ...createOrderDto,
      cart: cartId,
      userId,
    });
    const cart = await this.cartService.getCart(userId);
    const productsToUpdate = cart.items.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
    }));
    const result = await this.productService.updateMany(productsToUpdate);
    cart.isDeleted = true;
    await cart.save();
    // TODO: call Payment Service

    return newOrder;
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
