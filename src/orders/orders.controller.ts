import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Next,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { CartService } from 'src/cart/cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly cartService: CartService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('/')
  async createNewOrder(@Request() req, @Body() createOrderDto: CreateOrderDTO) {
    const { userId } = req.user;
    const cart = await this.cartService.getCart(userId);

    if (!cart) {
      throw new ForbiddenException('Cart does not exist');
    }

    const order = await this.ordersService.createOrder(
      userId,
      cart._id,
      createOrderDto,
    );
    console.log('ORDER::::', order);

    return order;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('/')
  async getUserOrders(@Request() req) {
    const { userId } = req.user;
    const orders = await this.ordersService.getUserOrders(userId);
    return orders;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('/:id')
  async getUserOrderById(@Request() req, @Param('id') orderId: string) {
    const { userId } = req.user;
    const order = await this.ordersService.getUserOrderById(orderId, userId);
    return order;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
