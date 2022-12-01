import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { ProductModule } from './products/products.module';
import { ShopsModule } from './shops/shops.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    ProductModule,
    UserModule,
    AuthModule,
    CartModule,
    OrdersModule,
    CategoriesModule,
    ShopsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
