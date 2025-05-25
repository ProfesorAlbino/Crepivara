// src/application/dto/ingredient-response.dto.ts
import { Optional } from '@nestjs/common';

export class IngredientResponseDto {
  @Optional()
  ingredient_id?: number;

  name: string;
}
