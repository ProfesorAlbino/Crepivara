import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ProductResponseDto } from "src/application/dto/product/product-response.dto";
import { ProductUseCaseApplication } from "src/application/use-cases/product/product-use-case-application";

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
}
