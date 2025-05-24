import { IngredientResponseDto } from "src/application/dto/ingredient/ingredient-response.dto";

export abstract class IngredientServiceAbstract {
  abstract findAll(): Promise<IngredientResponseDto[]>;
  abstract findById(id: string): Promise<IngredientResponseDto>;
  abstract create(ingredient: IngredientResponseDto): Promise<IngredientResponseDto>;
  abstract update(ingredient: IngredientResponseDto): Promise<IngredientResponseDto>;
  abstract delete(id: string): Promise<IngredientResponseDto>;
}