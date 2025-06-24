import { ProductIngredientResponseDto } from "src/application/dto/product/product-ingredient-response.dto";

export abstract class ProductIngredientServiceAbstract {
    abstract addProductIngredient(productIngredient: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto>;
    abstract getProductIngredientById(productIngredient: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto>;
    abstract updateProductIngredient(productIngredientOriginal: ProductIngredientResponseDto, productIngredientUpdated: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto>;
    abstract deleteProductIngredient(productIngredient: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto>;
    abstract getAllProductIngredients(): Promise<ProductIngredientResponseDto[]>;
}