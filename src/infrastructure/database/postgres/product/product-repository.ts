import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/core/entities/product.entity";
import { ProductRepositoryAbstract } from "src/core/interfaces/repository/products/product-repository.interface";
import { Repository } from "typeorm";
import { ProductTypeORM } from "./product-schema";

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
        const product = await this.productRepository.findOne({ where: { product_id: parseInt(id) } });
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
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
    getAllProducts(): Promise<ProductEntity[]> {
        return this.productRepository.find();
    }

}