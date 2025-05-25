import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductTypeORM } from '../product/product-schema';

@Entity('categories')
export class CategoryTypeORM {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  category_id: number;

  @Column({ name: 'name', length: 50, unique: true })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  created_at: Date;

  @OneToMany(() => ProductTypeORM, (product) => product.category)
  products?: ProductTypeORM[];
}