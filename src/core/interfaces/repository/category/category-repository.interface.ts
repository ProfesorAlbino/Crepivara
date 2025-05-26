import { categoryRequestDto } from "src/application/dto/category/category-request.dto";
import { CategoryEntity } from "src/core/entities/category.entity";

export abstract class CategoryRepositoryAbstract {
    abstract createCategory(category: categoryRequestDto): Promise<CategoryEntity>;
    abstract getCategoryById(categoryId: string): Promise<CategoryEntity>;
    abstract getAllCategories(): Promise<CategoryEntity[]>;
    abstract updateCategory(categoryId: string, category: categoryRequestDto): Promise<CategoryEntity>;
    abstract deleteCategory(categoryId: string): Promise<CategoryEntity>;
}