import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
         type: 'postgres',
        url: configService.get<string>('POSTGRES_CONNECTION_STRING') || '',
        entities: [],
        logging: configService.get('NODE_ENV') !== 'production',
        ssl: {
          rejectUnauthorized: false
        },
      }),
    }),
    // Register all entities to be available for DI
    TypeOrmModule.forFeature([]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class PostgresModule {}