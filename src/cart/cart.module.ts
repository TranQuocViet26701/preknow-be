import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './schemas/cart.schema';
import { ProductModule } from 'src/products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    ProductModule,
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
