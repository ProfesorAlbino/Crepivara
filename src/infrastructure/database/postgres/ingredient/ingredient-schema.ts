import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
  } from 'typeorm';

@Entity('ingredients')
export class IngredientTypeORM {
  @PrimaryGeneratedColumn({ name: 'ingredient_id' })
  ingredient_id: string;

  @Column()
  name: string;
}
