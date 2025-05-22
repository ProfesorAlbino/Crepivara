import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { UserUseCaseApplication } from './use-cases/user/user-use-case-application';

@Module({
  imports: [CoreModule],
  providers: [UserUseCaseApplication],
  exports: [UserUseCaseApplication],
})
export class ApplicationModule {} 