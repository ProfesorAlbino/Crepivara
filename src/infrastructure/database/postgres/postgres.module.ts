import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminUserTypeORM } from './user/user-schema';
import { UserRepository } from './user/user-repository';

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
        entities: [AdminUserTypeORM],
        ssl: {
          rejectUnauthorized: configService.get('POSTGRES_SSLMODE', 'false') === 'true',
          ca: configService.get('POSTGRES_SSL_CERT', ''),
        },
      }),
    }),
    // Register the AdminUserTypeORM entity
    TypeOrmModule.forFeature([AdminUserTypeORM]),
  ],
  providers: [UserRepository],
  exports: [TypeOrmModule, UserRepository],
})
export class PostgresModule {}