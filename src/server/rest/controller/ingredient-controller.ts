import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { IngredientResponseDto } from "src/application/dto/ingredient/ingredient-response.dto";
import { IngredientUseCaseApplication } from "src/application/use-cases/ingredient/ingredient-use-case-application";

@Controller('ingredients')
export class IngredientController {

    constructor(private ingredientUseCase: IngredientUseCaseApplication) {}

    @Post("create")
    async createIngredient(@Body() ingredientRequest: IngredientResponseDto): Promise<IngredientResponseDto> {
        return await this.ingredientUseCase.createIngredient(ingredientRequest);
    }

    @Get("all")
    async getAllIngredients(): Promise<IngredientResponseDto[]> {
        return await this.ingredientUseCase.getAllIngredients();
    }

    @Get('get/:id')
    async getIngredientById(@Param('id') id: string): Promise<IngredientResponseDto> {
        return await this.ingredientUseCase.getIngredientById(id);
    }

    @Delete('delete/:id')
    async deleteIngredient(@Param('id') id: string): Promise<void> {
        return await this.ingredientUseCase.deleteIngredient(id);
    }
    @Put('update/:id')
    async updateIngredient(@Param('id') id: string, @Body() ingredientRequest: IngredientResponseDto): Promise<IngredientResponseDto> {
        return await this.ingredientUseCase.updateIngredient(id, ingredientRequest);
    }
}