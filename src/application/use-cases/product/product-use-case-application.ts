import { Injectable } from "@nestjs/common";
import { ProductResponseDto } from "src/application/dto/product/product-response.dto";
import { ProductServiceAbstract } from "src/core/interfaces/service/product/product-service-interface";

@Injectable()
export class ProductUseCaseApplication {
    constructor(private readonly productService: ProductServiceAbstract) {}

    async createProduct(product: ProductResponseDto): Promise<ProductResponseDto> {
        return this.productService.createProduct(product);
    }

    async getProductById(id: string): Promise<ProductResponseDto> {
        return this.productService.getProductById(id);
    }

    async updateProduct(id: string, product: ProductResponseDto): Promise<ProductResponseDto> {
        return this.productService.updateProduct(id, product);
    }

    async deleteProduct(id: string): Promise<ProductResponseDto> {
        return this.productService.deleteProduct(id);
    }

    async getAllProducts(): Promise<ProductResponseDto[]> {
        return this.productService.getAllProducts();
    }
}
