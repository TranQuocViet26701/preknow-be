import { CreateShopDto } from './create-shop.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateShopDto extends PartialType(CreateShopDto) {}
