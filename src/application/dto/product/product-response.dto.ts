// src/application/dto/product-response.dto.ts
import { Optional } from '@nestjs/common';

export class ProductResponseDto {
  @Optional()
  product_id?: number;

  name: string;
  slug: string;

  @Optional()
  description?: string;

  price: number;

  @Optional()
  category_id?: number;

  @Optional()
  is_available?: boolean;

  @Optional()
  created_at?: Date;

  @Optional()
  updated_at?: Date;
}
