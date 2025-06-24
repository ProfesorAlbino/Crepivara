import { ProductImageEntity } from "src/core/entities/product-image.entity";

export abstract class ProductImageRepositoryAbstract {
    abstract addProductImage(productImage: ProductImageEntity): Promise<ProductImageEntity>;
    abstract getProductImageById(id: string): Promise<ProductImageEntity>;
    abstract updateProductImage(id: string, productImage: ProductImageEntity): Promise<ProductImageEntity>;
    abstract deleteProductImage(id: string): Promise<ProductImageEntity>;
    abstract getAllProductImages(): Promise<ProductImageEntity[]>;
}