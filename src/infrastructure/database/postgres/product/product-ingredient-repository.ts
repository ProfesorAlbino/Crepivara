import { ProductIngredientEntity } from "src/core/entities/product-ingredient-entity";
import { ProductIngredientRepositoryAbstract } from "src/core/interfaces/repository/products/product-ingredient-repository.interface";
import { ProductIngredientTypeORM } from "./product-ingredient-schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductIngredientRepository extends ProductIngredientRepositoryAbstract {

    constructor(
        @InjectRepository(ProductIngredientTypeORM)
        private readonly productIngredientRepository: Repository<ProductIngredientTypeORM>,
    ) {
        super();
    }

    addProductIngredient(productIngredient: ProductIngredientEntity): Promise<ProductIngredientEntity> {
        const productIngredientOrm = this.productIngredientRepository.create(productIngredient);
        return this.productIngredientRepository.save(productIngredientOrm);
    }

    async getProductIngredientById(productIngredient: ProductIngredientEntity): Promise<ProductIngredientEntity> {
        const productIngredientOrm = await this.productIngredientRepository.findOne({
            where: { 
                product_id: productIngredient.product_id,
                ingredient_id: productIngredient.ingredient_id
            }
        });
        if (!productIngredientOrm) {
            throw new Error("Product ingredient not found");
        }
        return productIngredientOrm;
    }

    async updateProductIngredient(productIngredientOriginal: ProductIngredientEntity, productIngredientUpdated: ProductIngredientEntity): Promise<ProductIngredientEntity> {
        const existingProductIngredient = await this.productIngredientRepository.findOne({ where: {product_id: productIngredientOriginal.product_id, ingredient_id: productIngredientOriginal.ingredient_id} });
        if (!existingProductIngredient) {
            throw new Error("Product ingredient not found");
        }
        const productIngredientTypeORM = this.productIngredientRepository.create({...existingProductIngredient, ...productIngredientUpdated});
        return this.productIngredientRepository.save(productIngredientTypeORM);
    }

    async deleteProductIngredient(productIngredient: ProductIngredientEntity): Promise<ProductIngredientEntity> {
        const productIngredientOrm = await this.productIngredientRepository.findOne({ where: {product_id: productIngredient.product_id, ingredient_id: productIngredient.ingredient_id} });
        if (!productIngredientOrm) {
            throw new Error("Product ingredient not found");
        }
        return this.productIngredientRepository.remove(productIngredientOrm);
    }

    async getAllProductIngredients(): Promise<ProductIngredientEntity[]> {
        return this.productIngredientRepository.find();
    }

}