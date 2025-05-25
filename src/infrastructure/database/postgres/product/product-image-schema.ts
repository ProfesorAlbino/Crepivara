import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { ProductTypeORM } from './product-schema';
  
  @Entity('product_images')
  export class ProductImageTypeORM {
    @PrimaryGeneratedColumn({ name: 'image_id' })
    image_id: number;
  
    @Column({ name: 'product_id' })
    product_id: number;
  
    // relación opcional, para poder cargar la entidad Product si la necesitas
    @ManyToOne(() => ProductTypeORM, (product) => product.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product?: ProductTypeORM;
  
    @Column({ name: 'image_url' })
    image_url: string;
  
    @Column({ name: 'alt_text', nullable: true })
    alt_text?: string;
  
    @Column({ name: 'sort_order', type: 'smallint', default: 0 })
    sort_order: number;
  }