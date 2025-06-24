import { Injectable } from "@nestjs/common";
import { ProductIngredientResponseDto } from "src/application/dto/product/product-ingredient-response.dto";
import { ProductIngredientEntity } from "src/core/entities/product-ingredient-entity";
import { ProductIngredientRepositoryAbstract } from "src/core/interfaces/repository/products/product-ingredient-repository.interface";
import { ProductIngredientServiceAbstract } from "src/core/interfaces/service/product/product-ingredient-interface";

@Injectable()
export class ProductIngredientService implements ProductIngredientServiceAbstract {
    constructor(
        private readonly productIngredientRepository: ProductIngredientRepositoryAbstract,
    ) {}

    async getProductIngredientById(productIngredient: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto> {
        const productIngredientEntity = await this.productIngredientRepository.getProductIngredientById(productIngredient);
        return productIngredientEntity;
    }
    async updateProductIngredient(productIngredientOriginal: ProductIngredientResponseDto, productIngredientUpdated: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto> {
        const productIngredientEntity = new ProductIngredientEntity(productIngredientOriginal);
        const productIngredientSaved = await this.productIngredientRepository.updateProductIngredient(productIngredientEntity, productIngredientUpdated);
        return productIngredientSaved;
    }
    async deleteProductIngredient(productIngredient: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto> {
        const productIngredientEntity = new ProductIngredientEntity(productIngredient);
        const productIngredientSaved = await this.productIngredientRepository.deleteProductIngredient(productIngredientEntity);
        return productIngredientSaved;
    }
    async getAllProductIngredients(): Promise<ProductIngredientResponseDto[]> {
        const productIngredientEntities = await this.productIngredientRepository.getAllProductIngredients();
        return productIngredientEntities;
    }

    async addProductIngredient(productIngredient: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto> {
        const productIngredientEntity = new ProductIngredientEntity(productIngredient);
        const productIngredientSaved = await this.productIngredientRepository.addProductIngredient(productIngredientEntity);
        return productIngredientSaved;
    }
}