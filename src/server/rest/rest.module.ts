import { Module, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CoreModule } from 'src/core/core.module';
import { ApplicationModule } from 'src/application/application.module';
import { UserAdminController } from './controller/user-admin-controller';

const providers: Provider[] = [

];

@Module({
    imports: [CoreModule, ApplicationModule],
    controllers: [UserAdminController],
    providers: providers,
  })
  export class RestModule {}