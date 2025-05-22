import { Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { UserServiceAbstract } from './interfaces/service/user/user-service-interface';
import { UserService } from './services/user/user.service';
import { UserRepository } from 'src/infrastructure/database/postgres/user/user-repository';
import { UserRepositoryAbstract } from './interfaces/repository/user/user-repository.interface';

@Module({
  imports: [InfrastructureModule],
  providers: [
    { provide: UserServiceAbstract, useClass: UserService },
    { provide: UserRepositoryAbstract, useClass: UserRepository },
  ],
  exports: [UserServiceAbstract],
})
export class CoreModule {}