import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ItemDTO } from './dtos/item.dto';
import { ProductService } from 'src/products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel('Cart') private readonly cartModel: Model<CartDocument>,
    private readonly productService: ProductService,
  ) {}

  private readonly logger = new Logger('Cart Service');

  async createCart(
    userId: string,
    itemDTO: ItemDTO,
    price: number,
    subTotalPrice: number,
    totalPrice: number,
    imageUrl: string,
  ): Promise<Cart> {
    const newCart = await this.cartModel.create({
      userId,
      items: [{ ...itemDTO, price, subTotalPrice, imageUrl }],
      totalPrice,
      isDeleted: false,
    });
    return newCart;
  }

  async getCart(userId: string): Promise<CartDocument> {
    const cart = await this.cartModel
      .findOne({ userId, isDeleted: false })
      .select(['-isDeleted']);
    return cart;
  }

  async getCartById(id: string): Promise<CartDocument> {
    const cart = await this.cartModel.findById(id).select(['-isDeleted']);
    return cart;
  }

  async deleteCart(userId: string): Promise<Cart> {
    const deletedCart = await this.cartModel.findOneAndRemove({ userId });
    return deletedCart;
  }

  private recalculateCart(cart: CartDocument) {
    cart.totalPrice = 0;
    cart.items.forEach((item) => {
      cart.totalPrice += item.quantity * item.price;
    });
  }

  async addItemToCart(userId: string, itemDTO: ItemDTO): Promise<Cart> {
    const { productId, quantity } = itemDTO;
    const { price, imageUrl } = await this.productService.getProductById(
      productId,
    );
    const subTotalPrice = quantity * price;

    const cart = await this.getCart(userId);

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId == productId,
      );

      if (itemIndex > -1) {
        const item = cart.items[itemIndex];
        item.quantity = Number(item.quantity) + Number(quantity);
        item.subTotalPrice = item.quantity * item.price;

        cart.items[itemIndex] = item;
      } else {
        cart.items.push({ ...itemDTO, price, subTotalPrice, imageUrl });
      }
      this.recalculateCart(cart);
      await cart.save();
      return cart;
    } else {
      const newCart = await this.createCart(
        userId,
        itemDTO,
        price,
        subTotalPrice,
        subTotalPrice,
        imageUrl,
      );
      return newCart;
    }
  }

  async removeItemFromCart(userId: string, productId: string): Promise<any> {
    const cart = await this.getCart(userId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId,
    );

    const { subTotalPrice } = cart.items[itemIndex];

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      cart.totalPrice -= subTotalPrice;
      await cart.save();
      return cart;
    }
  }
}
