import { Injectable } from "@nestjs/common";
import { ProductResponseDto } from "src/application/dto/product/product-response.dto";
import { ProductServiceAbstract } from "src/core/interfaces/service/product/product-service-interface";
import { ProductImageServiceAbstract } from "src/core/interfaces/service/product/product-image-interface";
import { ProductIngredientServiceAbstract } from "src/core/interfaces/service/product/product-ingredient-interface";
import { ProductImageResponseDto } from "src/application/dto/product/product-image-response.dto";
import { ProductIngredientResponseDto } from "src/application/dto/product/product-ingredient-response.dto";


@Injectable()
export class ProductUseCaseApplication {
    constructor(private readonly productService: ProductServiceAbstract, private readonly productImageService: ProductImageServiceAbstract, private readonly productIngredientService: ProductIngredientServiceAbstract) {}

    async createProduct(product: ProductResponseDto): Promise<ProductResponseDto> {
        return this.productService.createProduct(product);
    }

    async getProductById(id: string): Promise<ProductResponseDto> {
        return this.productService.getProductById(id);
    }

    async updateProduct(id: string, product: ProductResponseDto): Promise<ProductResponseDto> {
        return this.productService.updateProduct(id, product);
    }

    async deleteProduct(id: string): Promise<ProductResponseDto> {
        return this.productService.deleteProduct(id);
    }

    async getAllProducts(): Promise<ProductResponseDto[]> {
        return this.productService.getAllProducts();
    }

    async addProductImage(productImage: ProductImageResponseDto): Promise<ProductImageResponseDto> {
        return this.productImageService.addProductImage(productImage);
    }

    async getProductImageById(id: string): Promise<ProductImageResponseDto> {
        return this.productImageService.getProductImageById(id);
    }

    async updateProductImage(id: string, productImage: ProductImageResponseDto): Promise<ProductImageResponseDto> {
        return this.productImageService.updateProductImage(id, productImage);
    }

    async deleteProductImage(id: string): Promise<ProductImageResponseDto> {
        return this.productImageService.deleteProductImage(id);
    }

    async getAllProductImages(): Promise<ProductImageResponseDto[]> {
        return this.productImageService.getAllProductImages();
    }

    async addProductIngredient(productIngredient: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto> {
        return this.productIngredientService.addProductIngredient(productIngredient);
    }

    async getProductIngredientById(productIngredient: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto> {
        return this.productIngredientService.getProductIngredientById(productIngredient);
    }

    async updateProductIngredient(productIngredientOriginal: ProductIngredientResponseDto, productIngredientUpdated: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto> {
        return this.productIngredientService.updateProductIngredient(productIngredientOriginal, productIngredientUpdated);
    }

    async deleteProductIngredient(productIngredient: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto> {
        return this.productIngredientService.deleteProductIngredient(productIngredient);
    }

    async getAllProductIngredients(): Promise<ProductIngredientResponseDto[]> {
        return this.productIngredientService.getAllProductIngredients();
    }
}
