import { Module, Provider } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { ApplicationModule } from 'src/application/application.module';
import { UserAdminController } from './controller/user-admin-controller';
import { CategoriesController } from './controller/categories-controller';

const providers: Provider[] = [

];

@Module({
    imports: [CoreModule, ApplicationModule],
    controllers: [UserAdminController, CategoriesController],
    providers: providers,
  })
  export class RestModule {}