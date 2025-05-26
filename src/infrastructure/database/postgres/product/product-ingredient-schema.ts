// src/infrastructure/typeorm/entities/product-ingredient.typeorm.ts
import {
    Entity,
    Column,
    ManyToOne,
    PrimaryColumn,
    JoinColumn,
  } from 'typeorm';
  import { ProductTypeORM } from './product-schema';
  import { IngredientTypeORM } from '../ingredient/ingredient-schema';
  
  @Entity('product_ingredients')
  export class ProductIngredientTypeORM {
    @PrimaryColumn({ name: 'product_id' })
    product_id: number;
  
    @PrimaryColumn({ name: 'ingredient_id' })
    ingredient_id: number;
  
    @ManyToOne(() => ProductTypeORM, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: ProductTypeORM;
  
    @ManyToOne(() => IngredientTypeORM, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ingredient_id' })
    ingredient: IngredientTypeORM;
  }