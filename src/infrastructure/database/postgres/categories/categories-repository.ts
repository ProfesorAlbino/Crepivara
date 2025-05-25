import { InjectRepository } from "@nestjs/typeorm";
import { categoryRequestDto } from "src/application/dto/category/category-request.dto";
import { CategoryEntity } from "src/core/entities/category.entity";
import { CategoryRepositoryAbstract } from "src/core/interfaces/repository/category/category-repository.interface";
import { CategoryTypeORM } from "./categories-schema";
import { Repository } from "typeorm";

export class CategoryRepository extends CategoryRepositoryAbstract{

    constructor(
            @InjectRepository(CategoryTypeORM)
            private readonly categoryRepository: Repository<CategoryTypeORM>,
        ) {
        super();
    }

    createCategory(category: categoryRequestDto): Promise<CategoryEntity> {
        const newCategory = this.categoryRepository.create(category);
        return this.categoryRepository.save(newCategory);
    }
    async getCategoryById(categoryId: string): Promise<CategoryEntity> {
        const category = await this.categoryRepository.findOne({ where: { category_id: parseInt(categoryId) } });
        if (!category) {
            throw new Error("Category not found");
        }

        return category;
    }

    async getAllCategories(): Promise<CategoryEntity[]> {
        return this.categoryRepository.find();
    }
    async updateCategory(categoryId: string, category: categoryRequestDto): Promise<CategoryEntity> {
        const existingCategory = await this.categoryRepository.findOne({ where: { category_id: parseInt(categoryId) } });
        if (!existingCategory) {
            throw new Error("Category not found");
        }
        this.categoryRepository.merge(existingCategory, category);
        return this.categoryRepository.save(existingCategory);
    }
    async deleteCategory(categoryId: string): Promise<CategoryEntity> {
        const category = await this.categoryRepository.findOne({ where: { category_id: parseInt(categoryId) } });
        if (!category) {
            throw new Error("Category not found");
        }
        await this.categoryRepository.remove(category);
        return category;
    }
}