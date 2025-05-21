import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { GrpcModule as RealGrpcModule } from './server/grpc/grpc.module';
// import { ApplicationModule } from './application/application.module';
// import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    CoreModule,
    // ApplicationModule,
    // InfrastructureModule,
    // RealGrpcModule,
  ],
})

export class GrpcModule {}