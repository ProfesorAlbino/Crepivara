import { IngredientResponseDto } from "src/application/dto/ingredient/ingredient-response.dto";
import { IngredientRepositoryAbstract } from "src/core/interfaces/repository/ingredient/ingredient-repository.interface";
import { IngredientServiceAbstract } from "src/core/interfaces/service/ingredient/ingredient-service-interface";

export class IngredientService implements IngredientServiceAbstract{

    constructor(
        private readonly ingredientRepository: IngredientRepositoryAbstract,
    ) {}
    async findAll(): Promise<IngredientResponseDto[]> {
        return await this.ingredientRepository.findAll();
    }

    async findById(id: string): Promise<IngredientResponseDto> {
        return await this.ingredientRepository.findById(id);
    }

    async create(ingredient: IngredientResponseDto): Promise<IngredientResponseDto> {
        return await this.ingredientRepository.create(ingredient);
    }

    async update(ingredient: IngredientResponseDto): Promise<IngredientResponseDto> {
        return await this.ingredientRepository.update(ingredient);
    }

    async delete(id: string): Promise<IngredientResponseDto> {
        return await this.ingredientRepository.delete(id);
    }
}