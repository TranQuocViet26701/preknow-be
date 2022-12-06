import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product, ProductDocument } from './schemas/products.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger('Product Service');

  async getFilteredProducts({
    search,
    category,
    page = 1,
    limit = 20,
    orderBy,
  }: FilterProductDTO) {
    const sortProps: any =
      orderBy && orderBy !== 'created_at'
        ? {
            price: orderBy === 'max_price' ? -1 : 1,
          }
        : {
            _id: -1,
          };

    if (category && !search) {
      const categoryList = category.split(',');

      const products = await this.productModel
        .find({
          category_slug: { $in: categoryList },
        })
        .sort(sortProps)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      const count = await this.productModel.countDocuments({
        category_slug: { $in: categoryList },
      });

      return {
        data: products,
        count: products.length,
        total: count,
        from: (page - 1) * limit,
        to: (page - 1) * limit + products.length,
        per_page: +limit,
        current_page: +page,
        last_page: Math.ceil(count / limit),
      };
    }

    const products = await this.productModel
      .find({ $text: { $search: `${search} ${category}` } })
      .sort(sortProps)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const count = await this.productModel.countDocuments({
      $text: { $search: search },
    });

    return {
      data: products,
      count: products.length,
      total: count,
      from: (page - 1) * limit,
      to: (page - 1) * limit + products.length,
      per_page: +limit,
      current_page: +page,
      last_page: Math.ceil(count / limit),
    };
  }

  async getAllProducts({ page = 1, limit = 20, orderBy = '' }) {
    const sortProps: any =
      orderBy && orderBy !== 'created_at'
        ? {
            price: orderBy === 'max_price' ? -1 : 1,
          }
        : {
            _id: -1,
          };

    const products = await this.productModel
      .find()
      .sort(sortProps)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const count = await this.productModel.countDocuments();

    return {
      data: products,
      count: products.length,
      total: count,
      from: (page - 1) * limit,
      to: (page - 1) * limit + products.length,
      per_page: +limit,
      current_page: +page,
      last_page: Math.ceil(count / limit),
    };
  }

  async getPopularProducts({ page = 1, limit = 20 }) {
    const products = await this.productModel
      .find({
        price: { $gte: 90000 },
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return products;
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .populate('shop');

    return product;
  }

  async createProduct(createProductDto: CreateProductDTO): Promise<Product> {
    const category = await this.categoriesService.getCategoryBySlug(
      createProductDto.category_slug,
    );

    const newProduct = await this.productModel.create({
      ...createProductDto,
      category: category?._id,
    });

    return newProduct.save();
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const category = await this.categoriesService.getCategoryBySlug(
      updateProductDto.category_slug,
    );

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      {
        ...updateProductDto,
        category: category?._id,
      },
      { new: true },
    );

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndRemove(id);

    return deletedProduct;
  }

  async isInStock(id: string, quantityBuy: number): Promise<boolean> {
    const { quantity } = await this.getProductById(id);

    if (quantity < quantityBuy) {
      throw new BadRequestException('Not enough product in stock');
    }

    return true;
  }

  async updateMany(items: { id: string; quantity: number }[]) {
    const bulkArr = [];
    for (const item of items) {
      bulkArr.push({
        updateOne: {
          filter: { _id: item.id },
          update: { $inc: { quantity: -item.quantity } },
        },
      });
    }

    const result = await this.productModel.bulkWrite(bulkArr);
    return result;
  }
}
