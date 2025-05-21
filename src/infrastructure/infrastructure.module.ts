import { Module } from '@nestjs/common';
import { PostgresModule } from './database/postgres/postgres.module';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({
  imports: [
    //PostgresModule,
  ],
  providers: [
    
  ],
  exports: []
})
export class InfrastructureModule {}