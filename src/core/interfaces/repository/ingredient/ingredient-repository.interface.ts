import { IngredientEntity } from "src/core/entities/ingredient.entity";

export abstract class IngredientRepositoryAbstract {
  abstract findAll(): Promise<IngredientEntity[]>;
  abstract findById(id: string): Promise<IngredientEntity>;
  abstract create(ingredient: IngredientEntity): Promise<IngredientEntity>;
  abstract update(ingredient: IngredientEntity): Promise<IngredientEntity>;
  abstract delete(id: string): Promise<IngredientEntity>;
}