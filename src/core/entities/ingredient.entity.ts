// src/domain/entities/ingredient.entity.ts
export class IngredientEntity {
  ingredient_id?: number;
  name: string;

  constructor(props: { ingredient_id?: number; name: string }) {
    this.ingredient_id = props.ingredient_id;
    this.name = props.name;
  }
}