import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('/')
  async createNewOrder(
    @Request() req: any,
    @Body() createOrderDto: CreateOrderDTO,
  ) {
    const { userId } = req.user;

    const res = await this.ordersService.createOrder(userId, createOrderDto);

    return res;
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
