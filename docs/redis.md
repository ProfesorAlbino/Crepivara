# Redis Implementation Guide

This document provides details on how to implement Redis repositories for the NestJS microservice template.

## Setup

### 1. Configure Redis Connection

Make sure the Redis module is imported in your `infrastructure.module.ts`:

```typescript
// src/infrastructure/infrastructure.module.ts
@Module({
  imports: [
    RedisModule,
    // other database modules...
  ],
  // ...
})
```

### 2. Configure Redis Module

Set up the Redis module:

```typescript
// src/infrastructure/database/redis/redis.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';
import { RedisTransactionRepository } from './transaction/redis-transaction.repository';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({
  imports: [
    NestRedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD', ''),
          db: configService.get<number>('REDIS_DB', 0),
        },
      }),
    }),
  ],
  providers: [
    RedisTransactionRepository,
  ],
  exports: [REDIS_CLIENT, RedisTransactionRepository],
})
export class RedisModule {}
```

### 3. Implement Repository

Create your Redis repository implementation:

```typescript
// src/infrastructure/database/redis/transaction/redis-transaction.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { TransactionRepositoryAbstract } from '../../../../core/interfaces/repository/transaction/transaction-repository.interface';
import { TransactionEntity } from '../../../../core/entities/transaction/transaction.entity';

@Injectable()
export class RedisTransactionRepository extends TransactionRepositoryAbstract<TransactionEntity> {
  private readonly keyPrefix = 'transaction:';
  private readonly userTransactionsPrefix = 'user:transactions:';
  
  constructor(@InjectRedis() private readonly redis: Redis) {
    super();
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const key = this.getKey(id);
    const transactionData = await this.redis.get(key);
    
    if (!transactionData) return null;
    
    return this.deserializeTransaction(transactionData);
  }

  async deposit(userId: string, amount: number, metadata?: any): Promise<TransactionEntity> {
    const id = uuidv4();
    const transaction = new TransactionEntity({
      id,
      userId,
      amount,
      type: 'deposit',
      status: 'completed',
      createdAt: new Date(),
      metadata
    });
    
    await this.saveTransaction(transaction);
    await this.addToUserTransactions(userId, id);
    
    return transaction;
  }

  async withdraw(userId: string, amount: number, metadata?: any): Promise<TransactionEntity> {
    const id = uuidv4();
    const transaction = new TransactionEntity({
      id,
      userId,
      amount,
      type: 'withdrawal',
      status: 'completed',
      createdAt: new Date(),
      metadata
    });
    
    await this.saveTransaction(transaction);
    await this.addToUserTransactions(userId, id);
    
    return transaction;
  }

  async transferFunds(fromUserId: string, toUserId: string, amount: number): Promise<TransactionEntity> {
    const id = uuidv4();
    const transaction = new TransactionEntity({
      id,
      userId: fromUserId,
      amount,
      type: 'transfer',
      status: 'completed',
      createdAt: new Date(),
      metadata: { toUserId }
    });
    
    await this.saveTransaction(transaction);
    await this.addToUserTransactions(fromUserId, id);
    
    return transaction;
  }
  
  private getKey(id: string): string {
    return `${this.keyPrefix}${id}`;
  }
  
  private getUserTransactionsKey(userId: string): string {
    return `${this.userTransactionsPrefix}${userId}`;
  }
  
  private async saveTransaction(transaction: TransactionEntity): Promise<void> {
    const key = this.getKey(transaction.id);
    const serialized = JSON.stringify({
      id: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      createdAt: transaction.createdAt.toISOString(),
      metadata: transaction.metadata
    });
    
    await this.redis.set(key, serialized);
  }
  
  private async addToUserTransactions(userId: string, transactionId: string): Promise<void> {
    const userTransactionsKey = this.getUserTransactionsKey(userId);
    await this.redis.sadd(userTransactionsKey, transactionId);
  }
  
  private deserializeTransaction(data: string): TransactionEntity {
    const parsed = JSON.parse(data);
    return new TransactionEntity({
      id: parsed.id,
      userId: parsed.userId,
      amount: parsed.amount,
      type: parsed.type,
      status: parsed.status,
      createdAt: new Date(parsed.createdAt),
      metadata: parsed.metadata
    });
  }
}
```

## Usage

To use Redis as your database, update the `infrastructure.module.ts` to use the Redis implementation:

```typescript
@Module({
  imports: [
    RedisModule,
    // Comment out other database modules
    // MongodbModule,
    // PostgresModule,
  ],
  providers: [
    {
      provide: TransactionRepositoryAbstract,
      // Choose which implementation to use
      useExisting: RedisTransactionRepository
      // Comment out other implementations
      // useExisting: MongodbTransactionRepository
      // useExisting: PostgresTransactionRepository
    }
  ],
  exports: [RedisModule, TransactionRepositoryAbstract]
})
export class InfrastructureModule {} 
```

## Redis Patterns

### Working with Complex Data Structures

For more complex data structures or relationships, consider using Redis data structures:

#### Hashes

```typescript
// Store transaction data as a hash
await this.redis.hset(
  `${this.transactionPrefix}${id}`,
  'userId', transaction.userId,
  'amount', transaction.amount.toString(),
  'type', transaction.type,
  'status', transaction.status,
  'createdAt', transaction.createdAt.toISOString(),
  'metadata', JSON.stringify(transaction.metadata || {})
);

// Retrieve and parse hash data
const transactionData = await this.redis.hgetall(`${this.transactionPrefix}${id}`);
if (!Object.keys(transactionData).length) return null;

return this.mapHashToEntity(transactionData);
```

#### Lists for Collections

```typescript
// Add to user transaction list
await this.redis.lpush(`user:${userId}:transactions`, id);

// Get user transactions (paginated)
const transactionIds = await this.redis.lrange(`user:${userId}:transactions`, 0, 9); // First 10 transactions
```

#### Sets for Unique Collections

```typescript
// Track unique users
await this.redis.sadd('users', userId);

// Get all unique users
const allUsers = await this.redis.smembers('users');
```

### Transactions

For operations that require atomicity:

```typescript
const multi = this.redis.multi();

// Add transaction
multi.set(`${this.transactionPrefix}${id}`, JSON.stringify(transaction));
// Update user balance
multi.hincrby(`user:${userId}`, 'balance', amount);
// Add to transaction list
multi.lpush(`user:${userId}:transactions`, id);

// Execute all commands atomically
await multi.exec();
``` 