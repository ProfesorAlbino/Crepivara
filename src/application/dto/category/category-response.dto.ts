// src/application/dto/category-response.dto.ts
import { Optional } from '@nestjs/common';

export class CategoryResponseDTO {
  @Optional()
  category_id?: number;

  name: string;

  @Optional()
  description?: string;

  @Optional()
  created_at?: Date;
}
