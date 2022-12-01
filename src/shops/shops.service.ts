import { UpdateShopDto } from './dto/update-shop.dto';
import { CreateShopDto } from './dto/create-shop.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop, ShopDocument } from './schemas/shop.schema';

@Injectable()
export class ShopsService {
  constructor(@InjectModel(Shop.name) private shopModel: Model<ShopDocument>) {}

  async getShops() {
    const shops = await this.shopModel.find();

    return shops;
  }

  async getShop(id: string) {
    const shop = await this.shopModel.findById(id);

    return shop;
  }

  async create(createShopDto: CreateShopDto) {
    const newShop = new this.shopModel(createShopDto);

    return await newShop.save();
  }

  async update(id: string, updateShopDto: UpdateShopDto) {
    const updatedShop = await this.shopModel.findByIdAndUpdate(
      id,
      updateShopDto,
      {
        new: true,
      },
    );

    return updatedShop;
  }

  async remove(id: string) {
    const deletedShop = await this.shopModel.findByIdAndRemove(id);

    return deletedShop;
  }
}
