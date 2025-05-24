import { Injectable } from "@nestjs/common";
import { IngredientServiceAbstract } from "src/core/interfaces/service/ingredient/ingredient-service-interface";

@Injectable()
export class IngredientUseCaseApplication {

    constructor(private readonly ingredientService: IngredientServiceAbstract) {}

    async createIngredient(ingredientRequestDto: any): Promise<any> {
        const ingredient = await this.ingredientService.create(ingredientRequestDto);
        return ingredient;
    }

    async getIngredientById(ingredientId: string): Promise<any> {
        const ingredient = await this.ingredientService.findById(ingredientId);
        return ingredient;
    }

    async getAllIngredients(): Promise<any[]> {
        const ingredients = await this.ingredientService.findAll();
        return ingredients;
    }

    async updateIngredient(ingredientId: string, ingredientRequestDto: any): Promise<any> {
        const ingredient = await this.ingredientService.update(ingredientRequestDto);
        return ingredient;
    }

    async deleteIngredient(ingredientId: string): Promise<any> {
        const ingredient = await this.ingredientService.delete(ingredientId);
        return ingredient;
    }
}