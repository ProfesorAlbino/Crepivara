import { Injectable } from "@nestjs/common";
import { ProductImageResponseDto } from "src/application/dto/product/product-image-response.dto";
import { ProductImageEntity } from "src/core/entities/product-image.entity";
import { ProductImageRepositoryAbstract } from "src/core/interfaces/repository/products/product-image-repository.interface";
import { ProductImageServiceAbstract } from "src/core/interfaces/service/product/product-image-interface";

@Injectable()
export class ProductImageService implements ProductImageServiceAbstract {
    constructor(
        private readonly productImageRepository: ProductImageRepositoryAbstract,
    ) {}

    async getProductImageById(id: string): Promise<ProductImageResponseDto> {
        const productImageEntity = await this.productImageRepository.getProductImageById(id);
        return productImageEntity;
    }

    async updateProductImage(id: string, productImage: ProductImageResponseDto): Promise<ProductImageResponseDto> {
        const productImageEntity = new ProductImageEntity(productImage);
        const productImageSaved = await this.productImageRepository.updateProductImage(id, productImageEntity);
        return productImageSaved;
    }

    async deleteProductImage(id: string): Promise<ProductImageResponseDto> {
        const productImageEntity = await this.productImageRepository.deleteProductImage(id);
        return productImageEntity;
    }

    async getAllProductImages(): Promise<ProductImageResponseDto[]> {
        const productImageEntities = await this.productImageRepository.getAllProductImages();
        return productImageEntities;
    }

    async addProductImage(productImage: ProductImageResponseDto): Promise<ProductImageResponseDto> {
        const productImageEntity = new ProductImageEntity(productImage);
        const productImageSaved = await this.productImageRepository.addProductImage(productImageEntity);
        return productImageSaved;
    }
}   