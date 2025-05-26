import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/core/entities/product.entity";
import { ProductRepositoryAbstract } from "src/core/interfaces/repository/products/product-repository.interface";
import { Repository } from "typeorm";
import { ProductTypeORM } from "./product-schema";
import { IngredientEntity } from "src/core/entities/ingredient.entity";
import { ProductImageEntity } from "src/core/entities/product-image.entity";

@Injectable()
export class ProductRepository extends ProductRepositoryAbstract {
    constructor(
        @InjectRepository(ProductTypeORM)
        private readonly productRepository: Repository<ProductTypeORM>,
    ) {
        super();
    }
    createProduct(product: ProductEntity): Promise<ProductEntity> {
        const productTypeORM = this.productRepository.create(product);
        return this.productRepository.save(productTypeORM);
    }
    async getProductById(id: string): Promise<ProductEntity> {
        const productOrm = await this.productRepository.findOne({
          where: { product_id: +id },
          relations: [
            'images',
            'productIngredients',
            'productIngredients.ingredient',
          ],
        });
        if (!productOrm) throw new Error('Product not found');
    
        // mapeo a dominio
        const images = productOrm.images?.map(
          img =>
            new ProductImageEntity({
              image_id: img.image_id,
              product_id: img.product_id,
              image_url: img.image_url,
              alt_text: img.alt_text,
              sort_order: img.sort_order,
            }),
        );
    
        const ingredients =
          productOrm.productIngredients?.map(
            pi =>
              new IngredientEntity({
                ingredient_id: pi.ingredient.ingredient_id,
                name: pi.ingredient.name,
              }),
          );
    
        return new ProductEntity({
          product_id: productOrm.product_id,
          name: productOrm.name,
          slug: productOrm.slug,
          description: productOrm.description,
          price: Number(productOrm.price),
          category_id: productOrm.category_id,
          is_available: productOrm.is_available,
          created_at: productOrm.created_at,
          updated_at: productOrm.updated_at,
          images,
          ingredients,
        });
      }
      
    async updateProduct(id: string, product: ProductEntity): Promise<ProductEntity> {
        const existingProduct = await this.productRepository.findOne({ where: { product_id: parseInt(id) } });
        if (!existingProduct) {
            throw new Error("Product not found");
        }
        const productTypeORM = this.productRepository.create({...existingProduct, ...product});
        return this.productRepository.save(productTypeORM);
    }
    async deleteProduct(id: string): Promise<ProductEntity> {
        const product = await this.productRepository.findOne({ where: { product_id: parseInt(id) }});
        if (!product) {
            throw new Error("Product not found");
        }
        return this.productRepository.remove(product);
    }
    
    async getAllProducts(): Promise<ProductEntity[]> {
        const all = await this.productRepository.find({
          relations: [
            'images',
            'productIngredients',
            'productIngredients.ingredient',
          ],
        });
    
        return all.map(prod => {
          const images = prod.images?.map(img =>
            new ProductImageEntity({
              image_id: img.image_id,
              product_id: img.product_id,
              image_url: img.image_url,
              alt_text: img.alt_text,
              sort_order: img.sort_order,
            }),
          );
          const ingredients = prod.productIngredients?.map(pi =>
            new IngredientEntity({
              ingredient_id: pi.ingredient.ingredient_id,
              name: pi.ingredient.name,
            }),
          );
          return new ProductEntity({
            product_id: prod.product_id,
            name: prod.name,
            slug: prod.slug,
            description: prod.description,
            price: Number(prod.price),
            category_id: prod.category_id,
            is_available: prod.is_available,
            created_at: prod.created_at,
            updated_at: prod.updated_at,
            images,
            ingredients,
          });
        });
      }

}