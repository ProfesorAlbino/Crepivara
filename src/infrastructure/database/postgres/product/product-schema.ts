// src/infrastructure/typeorm/entities/product.typeorm.ts
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { CategoryTypeORM } from '../categories/categories-schema';
  import { ProductImageTypeORM } from './product-image-schema';
import { ProductIngredientTypeORM } from './product-ingredient-schema';
  
  @Entity('products')
  export class ProductTypeORM {
    @PrimaryGeneratedColumn({ name: 'product_id' })
    product_id: number;
  
    @Column({ name: 'name', length: 100 })
    name: string;
  
    @Column({ name: 'slug', type: 'text', unique: true })
    slug: string;
  
    @Column({ name: 'description', type: 'text', nullable: true })
    description?: string;
  
    @Column({ name: 'price', type: 'numeric', precision: 8, scale: 2 })
    price: number;
  
    @Column({ name: 'category_id', nullable: true })
    category_id?: number;
  
    @ManyToOne(() => CategoryTypeORM, (category) => category.products, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    category?: CategoryTypeORM;
  
    @Column({ name: 'is_available', type: 'boolean', default: true })
    is_available: boolean;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
    created_at: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'NOW()' })
    updated_at: Date;
  
    @OneToMany(() => ProductImageTypeORM, (img) => img.product, { cascade: true })
    images?: ProductImageTypeORM[];
  
    @OneToMany(() => ProductIngredientTypeORM, (pi) => pi.product, { cascade: true })
    productIngredients?: ProductIngredientTypeORM[];
  }