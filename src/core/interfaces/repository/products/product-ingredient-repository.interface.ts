import { ProductIngredientEntity } from "src/core/entities/product-ingredient-entity";

export abstract class ProductIngredientRepositoryAbstract {
    abstract addProductIngredient(productIngredient: ProductIngredientEntity): Promise<ProductIngredientEntity>;
    abstract getProductIngredientById(productIngredient: ProductIngredientEntity): Promise<ProductIngredientEntity>;
    abstract updateProductIngredient(productIngredientOriginal: ProductIngredientEntity, productIngredientUpdated: ProductIngredientEntity): Promise<ProductIngredientEntity>;
    abstract deleteProductIngredient(productIngredient: ProductIngredientEntity): Promise<ProductIngredientEntity>;
    abstract getAllProductIngredients(): Promise<ProductIngredientEntity[]>;
}