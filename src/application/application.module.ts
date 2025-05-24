import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { UserUseCaseApplication } from './use-cases/user/user-use-case-application';
import { CategoryUseCaseApplication } from './use-cases/category/category-use-case-application';

@Module({
  imports: [CoreModule],
  providers: [UserUseCaseApplication, CategoryUseCaseApplication],
  exports: [UserUseCaseApplication, CategoryUseCaseApplication],
})
export class ApplicationModule {} 