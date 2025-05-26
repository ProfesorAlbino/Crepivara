import { ProductEntity } from "src/core/entities/product.entity";

export abstract class ProductRepositoryAbstract {
    abstract createProduct(product: ProductEntity): Promise<ProductEntity>;
    abstract getProductById(id: string): Promise<ProductEntity>;
    abstract updateProduct(id: string, product: ProductEntity): Promise<ProductEntity>;
    abstract deleteProduct(id: string): Promise<ProductEntity>;
    abstract getAllProducts(): Promise<ProductEntity[]>;
}