# PostgreSQL Implementation Guide

This document provides details on how to implement PostgreSQL repositories for the NestJS microservice template.

## Setup

### 1. Configure PostgreSQL Connection

Make sure the PostgreSQL module is imported in your `infrastructure.module.ts`:

```typescript
// src/infrastructure/infrastructure.module.ts
@Module({
  imports: [
    PostgresModule,
    // other database modules...
  ],
  // ...
})
```

### 2. Create TypeORM Entities

Define your TypeORM entities in the corresponding module:

```typescript
// src/infrastructure/database/postgres/transaction/transaction.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class TransactionTypeORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['deposit', 'withdrawal', 'transfer']
  })
  type: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;
}
```

### 3. Implement Repository

Create your PostgreSQL repository implementation:

```typescript
// src/infrastructure/database/postgres/transaction/postgres-transaction.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepositoryAbstract } from '../../../../core/interfaces/repository/transaction/transaction-repository.interface';
import { TransactionEntity } from '../../../../core/entities/transaction/transaction.entity';
import { TransactionTypeORM } from './transaction.entity';

@Injectable()
export class PostgresTransactionRepository extends TransactionRepositoryAbstract<TransactionEntity> {
  constructor(
    @InjectRepository(TransactionTypeORM)
    private readonly transactionRepository: Repository<TransactionTypeORM>
  ) {
    super();
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) return null;
    
    return this.mapToEntity(transaction);
  }

  async deposit(userId: string, amount: number, metadata?: any): Promise<TransactionEntity> {
    const transaction = this.transactionRepository.create({
      userId,
      amount,
      type: 'deposit',
      status: 'completed',
      metadata
    });
    
    const savedTransaction = await this.transactionRepository.save(transaction);
    return this.mapToEntity(savedTransaction);
  }

  async withdraw(userId: string, amount: number, metadata?: any): Promise<TransactionEntity> {
    const transaction = this.transactionRepository.create({
      userId,
      amount,
      type: 'withdrawal',
      status: 'completed',
      metadata
    });
    
    const savedTransaction = await this.transactionRepository.save(transaction);
    return this.mapToEntity(savedTransaction);
  }

  async transferFunds(fromUserId: string, toUserId: string, amount: number): Promise<TransactionEntity> {
    const transaction = this.transactionRepository.create({
      userId: fromUserId,
      amount,
      type: 'transfer',
      status: 'completed',
      metadata: { toUserId }
    });
    
    const savedTransaction = await this.transactionRepository.save(transaction);
    return this.mapToEntity(savedTransaction);
  }

  private mapToEntity(ormEntity: TransactionTypeORM): TransactionEntity {
    return new TransactionEntity({
      id: ormEntity.id,
      userId: ormEntity.userId,
      amount: Number(ormEntity.amount), // Convert from decimal to number
      type: ormEntity.type as any,
      status: ormEntity.status as any,
      createdAt: ormEntity.createdAt,
      metadata: ormEntity.metadata
    });
  }
}
```

### 4. Configure PostgreSQL Module

Set up the PostgreSQL module:

```typescript
// src/infrastructure/database/postgres/postgres.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TransactionTypeORM } from './transaction/transaction.entity';
import { PostgresTransactionRepository } from './transaction/postgres-transaction.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [TransactionTypeORM],
        synchronize: process.env.NODE_ENV !== 'production', // Only for development
      }),
    }),
    TypeOrmModule.forFeature([TransactionTypeORM]),
  ],
  providers: [PostgresTransactionRepository],
  exports: [PostgresTransactionRepository],
})
export class PostgresModule {}
```

## Usage

To use PostgreSQL as your database, update the `infrastructure.module.ts` to use the PostgreSQL implementation:

```typescript
@Module({
  imports: [
    PostgresModule,
    // Comment out other database modules
    // MongodbModule,
    // RedisModule,
  ],
  providers: [
    {
      provide: TransactionRepositoryAbstract,
      useExisting: PostgresTransactionRepository
      // Comment out other implementations
      // useExisting: MongodbTransactionRepository
      // useExisting: RedisTransactionRepository
    }
  ],
  exports: [PostgresModule, TransactionRepositoryAbstract]
})
export class InfrastructureModule {} 