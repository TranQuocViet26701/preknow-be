import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { PER_PAGE } from 'src/config';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  private readonly logger = new Logger('Product Service');

  async getFilteredProducts(filterProductDto: FilterProductDTO) {
    const { search, category, page = 1 } = filterProductDto;

    if (category && !search) {
      const products = await this.productModel
        .find({ category })
        .skip((page - 1) * PER_PAGE)
        .limit(PER_PAGE)
        .exec();
      const count = await this.productModel.countDocuments({ category });

      return {
        products,
        currentPage: +page,
        totalPages: Math.ceil(count / PER_PAGE),
      };
    }

    const products = await this.productModel
      .find({ $text: { $search: `${search} ${category}` } })
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .exec();
    const count = await this.productModel.countDocuments({
      $text: { $search: search },
    });

    return {
      products,
      currentPage: page,
      totalPages: Math.ceil(count / PER_PAGE),
    };
  }

  async getAllProducts(page = 1) {
    const products = await this.productModel
      .find()
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .exec();
    const count = await this.productModel.countDocuments();

    return {
      products,
      currentPage: page,
      totalPages: Math.ceil(count / PER_PAGE),
    };
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
