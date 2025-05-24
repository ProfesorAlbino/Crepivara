import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
  } from 'typeorm';

  @Entity('categories')
  export class CategoryTypeORM{
    @PrimaryGeneratedColumn({ name: 'category_id' })
    categoryId: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description' })
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }