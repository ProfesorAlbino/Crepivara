import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { UserUseCaseApplication } from './use-cases/user/user-use-case-application';
import { CategoryUseCaseApplication } from './use-cases/category/category-use-case-application';
import { IngredientUseCaseApplication } from './use-cases/ingredient/ingredient-use-case-application';

@Module({
  imports: [CoreModule],
  providers: [UserUseCaseApplication, CategoryUseCaseApplication, IngredientUseCaseApplication],
  exports: [UserUseCaseApplication, CategoryUseCaseApplication, IngredientUseCaseApplication],
})
export class ApplicationModule {} 