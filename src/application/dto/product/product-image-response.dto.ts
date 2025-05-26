// src/application/dto/product-image-response.dto.ts
import { Optional } from '@nestjs/common';

export class ProductImageResponseDto {
  @Optional()
  image_id?: number;

  product_id: number;
  image_url: string;

  @Optional()
  alt_text?: string;

  @Optional()
  sort_order?: number;
}
