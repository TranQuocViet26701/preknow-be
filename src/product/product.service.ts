import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getFilteredProducts(
    filterProductDto: FilterProductDTO,
  ): Promise<Product[]> {
    // TODO: Update to filter by mongodb
    let { search, category } = filterProductDto;

    let products = await this.getAllProducts();

    if (search) {
      search = filterProductDto.search.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search),
      );
    }

    if (category) {
      category = filterProductDto.category.toLowerCase();

      products = products.filter((product) => product.category === category);
    }

    return products;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find();

    return products;
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);

    return product;
  }

  async createProduct(createProductDto: CreateProductDTO): Promise<Product> {
    const newProduct = await this.productModel.create(createProductDto);

    return newProduct.save();
  }

  async updateProduct(
    id: string,
    createProductDto: CreateProductDTO,
  ): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      createProductDto,
      { new: true },
    );

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndRemove(id);

    return deletedProduct;
  }
}
