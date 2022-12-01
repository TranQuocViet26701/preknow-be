import { UpdateShopDto } from './dto/update-shop.dto';
import { CreateShopDto } from './dto/create-shop.dto';
import { ShopsService } from './shops.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('shops')
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  @Get()
  findAll() {
    return this.shopsService.getShops();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopsService.getShop(id);
  }

  @Post()
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopsService.create(createShopDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopsService.update(id, updateShopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopsService.remove(id);
  }
}
