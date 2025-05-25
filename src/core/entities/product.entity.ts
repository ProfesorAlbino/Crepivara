// src/domain/entities/product.entity.ts
import { ProductImageEntity } from './product-image.entity';
import { IngredientEntity } from './ingredient.entity';

export class ProductEntity {
  product_id?: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  category_id?: number;
  is_available?: boolean;
  created_at?: Date;
  updated_at?: Date;
  images?: ProductImageEntity[];
  ingredients?: IngredientEntity[];

  constructor(props: {
    product_id?: number;
    name: string;
    slug: string;
    description?: string;
    price: number;
    category_id?: number;
    is_available?: boolean;
    created_at?: Date;
    updated_at?: Date;
    images?: ProductImageEntity[];
    ingredients?: IngredientEntity[];
  }) {
    this.product_id = props.product_id;
    this.name = props.name;
    this.slug = props.slug;
    this.description = props.description;
    this.price = props.price;
    this.category_id = props.category_id;
    this.is_available = props.is_available;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.images = props.images;
    this.ingredients = props.ingredients;
  }
}
