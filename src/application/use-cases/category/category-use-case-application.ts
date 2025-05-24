import { Inject, Injectable } from "@nestjs/common";
import { CategoryResponseDTO } from "src/application/dto/category/category-response.dto";
import { categoryRequestDto } from "src/application/dto/category/category-request.dto";
import { CategoryServiceAbstract } from "src/core/interfaces/service/category/category-service-interface";

@Injectable()
export class CategoryUseCaseApplication {

    constructor(private readonly categoryService: CategoryServiceAbstract) {}

    async createCategory(categoryRequestDto: categoryRequestDto): Promise<CategoryResponseDTO> {
        const category = await this.categoryService.createCategory(categoryRequestDto);
        return category;
    }

    async getCategoryById(categoryId: string): Promise<CategoryResponseDTO> {
        const category = await this.categoryService.getCategoryById(categoryId);
        return category;
    }

    async getAllCategories(): Promise<CategoryResponseDTO[]> {
        const categories = await this.categoryService.getAllCategories();
        return categories;
    }

    async updateCategory(categoryId: string, categoryRequestDto: categoryRequestDto): Promise<CategoryResponseDTO> {
        const category = await this.categoryService.updateCategory(categoryId, categoryRequestDto);
        return category;
    }
    
    async deleteCategory(categoryId: string): Promise<CategoryResponseDTO> {
        const category = await this.categoryService.deleteCategory(categoryId);
        return category;
    }
}