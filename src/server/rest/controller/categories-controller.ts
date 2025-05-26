import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CategoryUseCaseApplication } from "src/application/use-cases/category/category-use-case-application";
import { categoryRequestDto } from "src/application/dto/category/category-request.dto";
import { CategoryResponseDTO } from "src/application/dto/category/category-response.dto";

@Controller("categories")
export class CategoriesController {

    constructor(private readonly categoryUseCase: CategoryUseCaseApplication) {}

    @Post("/create")
    async createCategory(@Body() categoryRequestDto: categoryRequestDto): Promise<CategoryResponseDTO> {
        return this.categoryUseCase.createCategory(categoryRequestDto);
    }

    @Get("/get/:id")
    async getCategoryById(@Param("id") id: string): Promise<CategoryResponseDTO> {
        return this.categoryUseCase.getCategoryById(id);
    }

    @Get("/all")
    async getAllCategories(): Promise<CategoryResponseDTO[]> {
        return this.categoryUseCase.getAllCategories();
    }

    @Post("/update/:id")
    async updateCategory(@Param("id") id: string, @Body() categoryRequestDto: categoryRequestDto): Promise<CategoryResponseDTO> {
        return this.categoryUseCase.updateCategory(id, categoryRequestDto);
    }

    @Post("/delete/:id")
    async deleteCategory(@Param("id") id: string): Promise<CategoryResponseDTO> {
        return this.categoryUseCase.deleteCategory(id);
    }
}