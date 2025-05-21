import { Module } from '@nestjs/common';
import { RestModule } from './rest/rest.module';

@Module({
  imports: [
    // GraphqlModule,
    // GrpcModule,
    RestModule,
  ],
})
export class ServerModule {}