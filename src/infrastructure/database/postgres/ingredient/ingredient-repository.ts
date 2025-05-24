import { InjectRepository } from "@nestjs/typeorm";
import { IngredientEntity } from "src/core/entities/ingredient.entity";
import { IngredientRepositoryAbstract } from "src/core/interfaces/repository/ingredient/ingredient-repository.interface";
import { Repository } from "typeorm";
import { IngredientTypeORM } from "./ingredient-schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class IngredientRepository extends IngredientRepositoryAbstract{

    constructor(
                @InjectRepository(IngredientTypeORM)
                private readonly ingredientRepository: Repository<IngredientTypeORM>,
            ) {
            super();
        }

    async findAll(): Promise<IngredientEntity[]> {
        return await this.ingredientRepository.find();
    }

    async findById(id: string): Promise<IngredientEntity> {
        const ingredient = await this.ingredientRepository.findOne({ where: { ingredient_id: id } });
        if (!ingredient) {
            throw new Error("Ingredient not found");
        }
        return ingredient;
    }

    async create(ingredient: IngredientEntity): Promise<IngredientEntity> {
        return await this.ingredientRepository.save(ingredient);
    }

    async update(ingredient: IngredientEntity): Promise<IngredientEntity> {
        return await this.ingredientRepository.save(ingredient);
    }

    async delete(id: string): Promise<IngredientEntity> {
        const ingredient = await this.ingredientRepository.findOne({ where: { ingredient_id: id } });

        if (!ingredient) {
            throw new Error("Ingredient not found");
        }
        await this.ingredientRepository.remove(ingredient);
        // Optionally, you can return the deleted ingredient or a success message
        return ingredient;
    }

}