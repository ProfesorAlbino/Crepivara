import { ProductResponseDto } from "src/application/dto/product/product-response.dto";

export abstract class ProductServiceAbstract {
    abstract createProduct(product: ProductResponseDto): Promise<ProductResponseDto>;
    abstract getProductById(id: string): Promise<ProductResponseDto>;
    abstract updateProduct(id: string, product: ProductResponseDto): Promise<ProductResponseDto>;
    abstract deleteProduct(id: string): Promise<ProductResponseDto>;
    abstract getAllProducts(): Promise<ProductResponseDto[]>;
}