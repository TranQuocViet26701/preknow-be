import { CreateProductDTO } from './create-product.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDTO) {}
