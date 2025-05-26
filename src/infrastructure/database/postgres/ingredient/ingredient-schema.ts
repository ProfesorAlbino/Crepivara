// src/infrastructure/typeorm/entities/ingredient.typeorm.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ProductIngredientTypeORM } from '../product/product-ingredient-schema';

@Entity('ingredients')
export class IngredientTypeORM {
  @PrimaryGeneratedColumn({ name: 'ingredient_id' })
  ingredient_id: number;

  @Column({ name: 'name', length: 50, unique: true })
  name: string;

  @OneToMany(() => ProductIngredientTypeORM, (pi) => pi.ingredient)
  productLinks?: ProductIngredientTypeORM[];
}