import { Injectable } from "@nestjs/common";
import { categoryRequestDto } from "src/application/dto/category/category-request.dto";
import { CategoryResponseDTO } from "src/application/dto/category/category-response.dto";
import { CategoryRepositoryAbstract } from "src/core/interfaces/repository/category/category-repository.interface";
import { CategoryServiceAbstract } from "src/core/interfaces/service/category/category-service-interface";

@Injectable()
export class CategoryService implements CategoryServiceAbstract{

    constructor(private readonly categoryRepository: CategoryRepositoryAbstract) {}

    async getAllCategories(): Promise<CategoryResponseDTO[]> {
        return await this.categoryRepository.getAllCategories();
    }
    async getCategoryById(categoryId: string): Promise<CategoryResponseDTO> {
        return await this.categoryRepository.getCategoryById(categoryId);
    }
    async createCategory(category: categoryRequestDto): Promise<CategoryResponseDTO> {
        return await this.categoryRepository.createCategory(category);
    }
    async updateCategory(categoryId: string, category: categoryRequestDto): Promise<CategoryResponseDTO> {
        return await this.categoryRepository.updateCategory(categoryId, category);
    }
    async deleteCategory(categoryId: string): Promise<CategoryResponseDTO> {
        return await this.categoryRepository.deleteCategory(categoryId);
    }
}