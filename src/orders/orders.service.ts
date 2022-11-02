import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/products/products.service';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { Order, OrderDocument } from './schemas/orders.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<OrderDocument>,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
  ) {}

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
