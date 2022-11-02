import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/orders.schema';
import { ProductModule } from 'src/products/products.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    ProductModule,
    CartModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
