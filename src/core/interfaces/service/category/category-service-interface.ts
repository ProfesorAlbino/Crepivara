import { categoryRequestDto } from "src/application/dto/category/category-request.dto";
import { CategoryResponseDTO } from "src/application/dto/category/category-response.dto";

export abstract class CategoryServiceAbstract {
    abstract getAllCategories(): Promise<CategoryResponseDTO[]>;
    abstract getCategoryById(categoryId: string): Promise<CategoryResponseDTO>;
    abstract createCategory(category: categoryRequestDto): Promise<CategoryResponseDTO>;
    abstract updateCategory(categoryId: string, category: categoryRequestDto): Promise<CategoryResponseDTO>;
    abstract deleteCategory(categoryId: string): Promise<CategoryResponseDTO>;
}