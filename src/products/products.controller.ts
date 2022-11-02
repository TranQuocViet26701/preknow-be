import {
  Body,
  Logger,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { ProductService } from './products.service';

@Controller('store/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  private readonly logger = new Logger('Product Controller');

  @Get('/')
  async getProducts(@Query() filterProductDto: FilterProductDTO) {
    if (
      Object.keys(filterProductDto).length === 1 &&
      +filterProductDto.page > 0
    ) {
      const products = await this.productService.getAllProducts(
        +filterProductDto.page,
      );
      return products;
    }

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Merchant, Role.Admin)
  @Post('/')
  async createProduct(@Body() createProductDto: CreateProductDTO) {
    const newProduct = await this.productService.createProduct(
      createProductDto,
    );
    return newProduct;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Merchant, Role.Admin)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Merchant, Role.Admin)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.deleteProduct(id);

    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }
}
