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
        host: configService.get('POSTGRES_HOST', 'localhost'),
        port: parseInt(configService.get('POSTGRES_PORT', '5432')),
        username: configService.get('POSTGRES_USER', 'postgres'),
        password: configService.get('POSTGRES_PASSWORD', 'postgres'),
        database: configService.get('POSTGRES_DB', 'database'),
        entities: [],
        ssl: {
          rejectUnauthorized: configService.get('POSTGRES_SSLMODE', 'false') === 'true',
          ca: configService.get('POSTGRES_SSL_CERT', ''),
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