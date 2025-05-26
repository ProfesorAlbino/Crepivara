import { Injectable } from "@nestjs/common";
import { ProductResponseDto } from "src/application/dto/product/product-response.dto";
import { ProductServiceAbstract } from "src/core/interfaces/service/product/product-service-interface";
import { ProductRepositoryAbstract } from "src/core/interfaces/repository/products/product-repository.interface";

@Injectable()
export class ProductService extends ProductServiceAbstract {
    constructor(private readonly productRepository: ProductRepositoryAbstract) {
        super();
    }
    createProduct(product: ProductResponseDto): Promise<ProductResponseDto> {
        const productEntity = {
            ...product,
            is_available: product.is_available ?? true
        };
        return this.productRepository.createProduct(productEntity);
    }
    getProductById(id: string): Promise<ProductResponseDto> {
        return this.productRepository.getProductById(id);
    }
    updateProduct(id: string, product: ProductResponseDto): Promise<ProductResponseDto> {
        const productEntity = {
            ...product,
            is_available: product.is_available ?? true
        };
        return this.productRepository.updateProduct(id, productEntity);
    }
    deleteProduct(id: string): Promise<ProductResponseDto> {
        return this.productRepository.deleteProduct(id);
    }
    getAllProducts(): Promise<ProductResponseDto[]> {
        return this.productRepository.getAllProducts();
    }

}