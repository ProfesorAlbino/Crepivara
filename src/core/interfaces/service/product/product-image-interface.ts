import { ProductImageResponseDto } from "src/application/dto/product/product-image-response.dto";

export abstract class ProductImageServiceAbstract {
    abstract addProductImage(productImage: ProductImageResponseDto): Promise<ProductImageResponseDto>;
    abstract getProductImageById(id: string): Promise<ProductImageResponseDto>;
    abstract updateProductImage(id: string, productImage: ProductImageResponseDto): Promise<ProductImageResponseDto>;
    abstract deleteProductImage(id: string): Promise<ProductImageResponseDto>;
    abstract getAllProductImages(): Promise<ProductImageResponseDto[]>;
}
