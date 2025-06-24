import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ProductResponseDto } from "src/application/dto/product/product-response.dto";
import { ProductUseCaseApplication } from "src/application/use-cases/product/product-use-case-application";
import { ProductIngredientResponseDto } from "src/application/dto/product/product-ingredient-response.dto";
import { ProductImageResponseDto } from "src/application/dto/product/product-image-response.dto";
@Controller('products')
export class ProductController {
    constructor(private readonly productUseCaseApplication: ProductUseCaseApplication) {}

    @Post()
    async createProduct(@Body() product: ProductResponseDto): Promise<ProductResponseDto> {
        return this.productUseCaseApplication.createProduct(product);
    }

    @Get(':id')
    async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
        return this.productUseCaseApplication.getProductById(id);
    }

    @Put(':id')
    async updateProduct(@Param('id') id: string, @Body() product: ProductResponseDto): Promise<ProductResponseDto> {
        return this.productUseCaseApplication.updateProduct(id, product);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string): Promise<ProductResponseDto> {
        return this.productUseCaseApplication.deleteProduct(id);
    }

    @Get()
    async getAllProducts(): Promise<ProductResponseDto[]> {
        return this.productUseCaseApplication.getAllProducts();
    }

    @Post('ingredients')
    async addProductIngredient(@Body() productIngredient: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto> {
        return this.productUseCaseApplication.addProductIngredient(productIngredient);
    }

    @Post('ingredients/by-id')
    async getProductIngredientById(@Body() productIngredient: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto> {
        return this.productUseCaseApplication.getProductIngredientById(productIngredient);
    }

    @Put('ingredients')
    async updateProductIngredient(@Body() productIngredientOriginal: ProductIngredientResponseDto, @Body() productIngredientUpdated: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto> {
        return this.productUseCaseApplication.updateProductIngredient(productIngredientOriginal, productIngredientUpdated);
    }

    @Delete('ingredients')
    async deleteProductIngredient(@Body() productIngredient: ProductIngredientResponseDto): Promise<ProductIngredientResponseDto> {
        return this.productUseCaseApplication.deleteProductIngredient(productIngredient);
    }

    @Get('ingredients')
    async getAllProductIngredients(): Promise<ProductIngredientResponseDto[]> {
        return this.productUseCaseApplication.getAllProductIngredients();
    }

    @Post('images')
    async addProductImage(@Body() productImage: ProductImageResponseDto): Promise<ProductImageResponseDto> {
        return this.productUseCaseApplication.addProductImage(productImage);
    }

    @Get('images')
    async getAllProductImages(): Promise<ProductImageResponseDto[]> {
        return this.productUseCaseApplication.getAllProductImages();
    }

    @Post('images/by-id')
    async getProductImageById(@Param('id') id: string): Promise<ProductImageResponseDto> {
        return this.productUseCaseApplication.getProductImageById(id);
    }

    @Put('images')
    async updateProductImage(@Param('id') id: string, @Body() productImage: ProductImageResponseDto): Promise<ProductImageResponseDto> {
        return this.productUseCaseApplication.updateProductImage(id, productImage);
    }

    @Delete('images')
    async deleteProductImage(@Param('id') id: string): Promise<ProductImageResponseDto> {
        return this.productUseCaseApplication.deleteProductImage(id);
    }
    
}
