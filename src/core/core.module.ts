import { Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { UserServiceAbstract } from './interfaces/service/user/user-service-interface';
import { UserService } from './services/user/user.service';
import { UserRepository } from 'src/infrastructure/database/postgres/user/user-repository';
import { UserRepositoryAbstract } from './interfaces/repository/user/user-repository.interface';
import { CategoryServiceAbstract } from './interfaces/service/category/category-service-interface';
import { CategoryService } from './services/category/category.service';
import { CategoryRepositoryAbstract } from './interfaces/repository/category/category-repository.interface';
import { CategoryRepository } from 'src/infrastructure/database/postgres/categories/categories-repository';
import { IngredientServiceAbstract } from './interfaces/service/ingredient/ingredient-service-interface';
import { IngredientService } from './services/ingredient/ingredient.service';
import { IngredientRepositoryAbstract } from './interfaces/repository/ingredient/ingredient-repository.interface';
import { IngredientRepository } from 'src/infrastructure/database/postgres/ingredient/ingredient-repository';
import { ProductService } from './services/products/product.service';
import { ProductRepository } from 'src/infrastructure/database/postgres/product/product-repository';
import { ProductServiceAbstract } from './interfaces/service/product/product-service-interface';
import { ProductRepositoryAbstract } from './interfaces/repository/products/product-repository.interface';

@Module({
  imports: [InfrastructureModule],
  providers: [
    { provide: UserServiceAbstract, useClass: UserService },
    { provide: UserRepositoryAbstract, useClass: UserRepository },
    { provide: CategoryServiceAbstract, useClass: CategoryService },
    { provide: CategoryRepositoryAbstract, useClass: CategoryRepository },
    { provide: IngredientServiceAbstract, useClass: IngredientService },
    { provide: IngredientRepositoryAbstract, useClass: IngredientRepository },
    { provide: ProductServiceAbstract, useClass: ProductService },
    { provide: ProductRepositoryAbstract, useClass: ProductRepository },
  ],
  exports: [UserServiceAbstract, CategoryServiceAbstract, UserRepositoryAbstract, CategoryRepositoryAbstract, IngredientServiceAbstract, IngredientRepositoryAbstract, ProductServiceAbstract, ProductRepositoryAbstract],
})
export class CoreModule {}