import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Delete,
  NotFoundException,
  ForbiddenException,
  Patch,
  Get,
  Param,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CartService } from './cart.service';
import { ItemDTO } from './dtos/item.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('/')
  async addItemToCart(@Request() req, @Body() itemDTO: ItemDTO) {
    const { userId } = req.user;
    const cart = await this.cartService.addItemToCart(userId, itemDTO);
    return cart;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('/')
  async getUserCart(@Request() req) {
    const { userId } = req.user;
    const cart = await this.cartService.getCart(userId);
    if (!cart) throw new NotFoundException('Cart does not exist');
    return cart;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('/:id')
  async getCartById(@Request() req, @Param('id') cartId: string) {
    const { userId } = req.user;
    const cart = await this.cartService.getCartById(cartId);
    if (!cart || cart.userId.toString() !== userId) {
      throw new ForbiddenException();
    }
    return cart;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Patch('/')
  async removeItemFromCart(@Request() req, @Body() { productId }) {
    const userId = req.user.userId;
    console.log('hihi');

    const cart = await this.cartService.removeItemFromCart(userId, productId);
    if (!cart) throw new NotFoundException('Item does not exist');
    return cart;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Delete('/')
  async deleteCart(@Request() req) {
    const { userId } = req.user;
    const cart = await this.cartService.deleteCart(userId);
    if (!cart) throw new NotFoundException('Cart does not exist');
    return cart;
  }
}
