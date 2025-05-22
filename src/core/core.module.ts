import { Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { UserServiceAbstract } from './interfaces/service/user/user-service-interface';
import { UserService } from './services/user/user.service';

@Module({
  imports: [InfrastructureModule],
  providers: [
    { provide: UserServiceAbstract, useClass: UserService },
  ],
  exports: [UserServiceAbstract],
})
export class CoreModule {}