import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { ProductService } from './product.service';

@Controller('store/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  async getProducts(@Query() filterProductDto: FilterProductDTO) {
    if (Object.keys(filterProductDto).length) {
      const filterProducts = await this.productService.getFilteredProducts(
        filterProductDto,
      );

      return filterProducts;
    }

    const allProducts = await this.productService.getAllProducts();
    return allProducts;
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getProductById(id);

    if (!product) throw new NotFoundException('Product does not exist!');

    return product;
  }

  @Post('/')
  async createProduct(@Body() createProductDto: CreateProductDTO) {
    const newProduct = await this.productService.createProduct(
      createProductDto,
    );
    return newProduct;
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDTO,
  ) {
    const product = await this.productService.updateProduct(
      id,
      updateProductDto,
    );

    if (!product) throw new NotFoundException('Product does not exist!');

    return product;
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.deleteProduct(id);

    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }
}
