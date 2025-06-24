import { ProductImageRepositoryAbstract } from "src/core/interfaces/repository/products/product-image-repository.interface";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductImageTypeORM } from "./product-image-schema";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductImageEntity } from "src/core/entities/product-image.entity";

@Injectable()
export class ProductImageRepository extends ProductImageRepositoryAbstract {
    
    constructor(
        @InjectRepository(ProductImageTypeORM)
        private readonly productImageRepository: Repository<ProductImageTypeORM>,
    ) {
        super();
    }

    async addProductImage(productImage: ProductImageEntity): Promise<ProductImageEntity> {
        const productImageOrm = this.productImageRepository.create(productImage);
        return this.productImageRepository.save(productImageOrm);
    }

    async getProductImageById(id: string): Promise<ProductImageEntity> {
        const productImageOrm = await this.productImageRepository.findOne({ where: { image_id: parseInt(id) } });
        if (!productImageOrm) {
            throw new Error("Product image not found");
        }
        return productImageOrm;
    }
    
    async updateProductImage(id: string, productImage: ProductImageEntity): Promise<ProductImageEntity> {
        const existingProductImage = await this.productImageRepository.findOne({ where: { image_id: parseInt(id) } });
        if (!existingProductImage) {
            throw new Error("Product image not found");
        }
        const productImageTypeORM = this.productImageRepository.create({...existingProductImage, ...productImage});
        return this.productImageRepository.save(productImageTypeORM);
    }
    
    async deleteProductImage(id: string): Promise<ProductImageEntity> {
        const productImageOrm = await this.productImageRepository.findOne({ where: { image_id: parseInt(id) } });
        if (!productImageOrm) {
            throw new Error("Product image not found");
        }
        return this.productImageRepository.remove(productImageOrm);
    }

    async getAllProductImages(): Promise<ProductImageEntity[]> {
        return this.productImageRepository.find();
    }
}