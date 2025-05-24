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

@Module({
  imports: [InfrastructureModule],
  providers: [
    { provide: UserServiceAbstract, useClass: UserService },
    { provide: UserRepositoryAbstract, useClass: UserRepository },
    { provide: CategoryServiceAbstract, useClass: CategoryService },
    { provide: CategoryRepositoryAbstract, useClass: CategoryRepository }
  ],
  exports: [UserServiceAbstract, CategoryServiceAbstract, UserRepositoryAbstract, CategoryRepositoryAbstract],
})
export class CoreModule {}