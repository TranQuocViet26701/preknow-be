import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async getCategories() {
    return this.categoryModel.find();
  }

  async getCategory(id: string) {
    try {
      const category = await this.categoryModel.findById(id);
      return category;
    } catch (err) {
      return err;
    }
  }

  async create(creatCategoryDto: CreateCategoryDto) {
    const newCategory = new this.categoryModel(creatCategoryDto);

    return await newCategory.save();
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      {
        new: true,
      },
    );

    return updatedCategory;
  }

  async remove(id: string) {
    const deletedCategory = await this.categoryModel.findByIdAndRemove(id);

    return deletedCategory;
  }
}
