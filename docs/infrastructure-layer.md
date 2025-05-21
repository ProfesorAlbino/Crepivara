# Infrastructure Layer Guide

The Infrastructure Layer provides implementations for the interfaces defined in the Core Layer. It contains all the code that interacts with external systems such as databases, messaging queues, file systems, and third-party services.

## Table of Contents

- [Purpose](#purpose)
- [Components](#components)
  - [Repositories](#repositories)
  - [Database Modules](#database-modules)
  - [External Services](#external-services)
  - [Persistence Entities](#persistence-entities)
- [Implementation Guidelines](#implementation-guidelines)
- [Integration with Other Layers](#integration-with-other-layers)
- [Examples](#examples)
  - [MongoDB Implementation](#mongodb-implementation)
  - [PostgreSQL Implementation](#postgresql-implementation)
  - [Redis Implementation](#redis-implementation)
  - [External Service Integration](#external-service-integration)

## Purpose

The Infrastructure Layer serves these key purposes:

1. **Implementation of Core Interfaces**: Provides concrete implementations of repository and service interfaces defined in the Core Layer
2. **External System Integration**: Connects to databases, message queues, file systems, and external APIs
3. **Technical Concerns**: Handles infrastructure-specific concerns like connection pooling, caching, and retries
4. **Data Mapping**: Maps between domain entities and persistence models
5. **Configuration**: Manages configuration for external dependencies

## Components

### Repositories

Repository implementations provide concrete database access logic for the abstract repository interfaces defined in the Core Layer.

**Implementation Pattern:**

1. Create repository classes that implement Core Layer repository interfaces
2. Use ORM/ODM frameworks or database clients for data access
3. Map between persistence models and domain entities
4. Handle database-specific concerns (transactions, optimistic locking, etc.)

### Database Modules

Database modules configure and manage database connections for specific database technologies.

**Implementation Pattern:**

1. Create a module for each database technology
2. Configure database connections using NestJS providers
3. Export repositories for use by other modules
4. Use environment variables for configuration

### External Services

External service integrations provide implementations for interfaces that interact with external APIs or services.

**Implementation Pattern:**

1. Create service classes that implement Core Layer service interfaces
2. Use HTTP clients or SDKs to interact with external services
3. Handle retries, circuit breaking, and other resilience patterns
4. Map between external service responses and domain models

### Persistence Entities

Persistence entities define the database schema for storing domain entities.

**Implementation Pattern:**

1. Create ORM/ODM entity classes for each domain entity
2. Define database-specific metadata (indexes, constraints, etc.)
3. Keep separate from domain entities
4. Include mapping logic to convert between persistence and domain models

## Implementation Guidelines

When implementing the Infrastructure Layer, follow these guidelines:

1. **Dependency Inversion**: Implement interfaces defined in the Core Layer
2. **Separation of Concerns**: Keep database-specific code isolated from domain logic
3. **Framework Integration**: Integrate with ORM/ODM frameworks as needed
4. **Mapping**: Map between persistence models and domain entities
5. **Configuration**: Use environment variables for configuration
6. **Error Handling**: Translate infrastructure errors to domain errors
7. **Transaction Management**: Implement transaction handling as required by the domain
8. **Module Registration**: Register all repositories and services in the infrastructure module

## Integration with Other Layers

The Infrastructure Layer:

- **Depends on**: Core Layer (implements its interfaces)
- **Is depended on by**: Core Layer (uses these implementations through dependency injection)

Key integration points:

1. **Repository Interfaces**: Defined in Core, implemented in Infrastructure
2. **External Service Interfaces**: Defined in Core, implemented in Infrastructure
3. **Entity Mapping**: Maps between persistence models and domain entities
4. **Error Translation**: Translates infrastructure errors to domain errors

## Examples

### MongoDB Implementation

**MongoDB Module:**

```typescript
// src/infrastructure/database/mongodb/mongodb.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Transaction, TransactionSchema } from './transaction/transaction.schema';
import { User, UserSchema } from './user/user.schema';
import { MongodbTransactionRepository } from './transaction/mongodb-transaction.repository';
import { MongodbUserRepository } from './user/mongodb-user.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [MongodbTransactionRepository, MongodbUserRepository],
  exports: [MongodbTransactionRepository, MongodbUserRepository],
})
export class MongodbModule {}
```

**MongoDB Schema:**

```typescript
// src/infrastructure/database/mongodb/transaction/transaction.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Transaction {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['deposit', 'withdrawal', 'transfer'] })
  type: string;

  @Prop({ required: true, enum: ['pending', 'completed', 'failed'], default: 'pending' })
  status: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
```

**MongoDB Repository Implementation:**

```typescript
// src/infrastructure/database/mongodb/transaction/mongodb-transaction.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionEntity } from '../../../../core/entities/transaction/transaction.entity';
import { TransactionRepositoryAbstract } from '../../../../core/interfaces/repository/transaction/transaction-repository.interface';
import { Transaction } from './transaction.schema';

@Injectable()
export class MongodbTransactionRepository extends TransactionRepositoryAbstract<TransactionEntity> {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>
  ) {
    super();
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) return null;
    
    return this.mapToEntity(transaction);
  }
  
  async findByUserId(userId: string): Promise<TransactionEntity[]> {
    const transactions = await this.transactionModel.find({ userId }).exec();
    return transactions.map(transaction => this.mapToEntity(transaction));
  }

  async deposit(userId: string, amount: number, metadata?: any): Promise<TransactionEntity> {
    const newTransaction = new this.transactionModel({
      userId,
      amount,
      type: 'deposit',
      status: 'completed',
      metadata
    });
    
    const savedTransaction = await newTransaction.save();
    return this.mapToEntity(savedTransaction);
  }

  async withdraw(userId: string, amount: number, metadata?: any): Promise<TransactionEntity> {
    const newTransaction = new this.transactionModel({
      userId,
      amount,
      type: 'withdrawal',
      status: 'completed',
      metadata
    });
    
    const savedTransaction = await newTransaction.save();
    return this.mapToEntity(savedTransaction);
  }

  async transferFunds(fromUserId: string, toUserId: string, amount: number): Promise<TransactionEntity> {
    const newTransaction = new this.transactionModel({
      userId: fromUserId,
      amount,
      type: 'transfer',
      status: 'completed',
      metadata: { toUserId }
    });
    
    const savedTransaction = await newTransaction.save();
    return this.mapToEntity(savedTransaction);
  }
  
  async update(transaction: TransactionEntity): Promise<TransactionEntity> {
    const updatedTransaction = await this.transactionModel
      .findByIdAndUpdate(
        transaction.id,
        {
          status: transaction.status,
          metadata: transaction.metadata
        },
        { new: true }
      )
      .exec();
      
    if (!updatedTransaction) {
      throw new NotFoundError('Transaction', transaction.id);
    }
    
    return this.mapToEntity(updatedTransaction);
  }
  
  private mapToEntity(document: TransactionDocument): TransactionEntity {
    const entity = new TransactionEntity({
      id: document._id.toString(),
      userId: document.userId,
      amount: document.amount,
      type: document.type as any,
      status: document.status as any,
      createdAt: document.createdAt,
      metadata: document.metadata
    });
    
    return entity;
  }
}
```

### PostgreSQL Implementation

**PostgreSQL Module:**

```typescript
// src/infrastructure/database/postgres/postgres.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TransactionEntity } from './transaction/transaction.entity';
import { UserEntity } from './user/user.entity';
import { PostgresTransactionRepository } from './transaction/postgres-transaction.repository';
import { PostgresUserRepository } from './user/postgres-user.repository';

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
        entities: [TransactionEntity, UserEntity],
        synchronize: configService.get<boolean>('POSTGRES_SYNC', false),
      }),
    }),
    TypeOrmModule.forFeature([TransactionEntity, UserEntity]),
  ],
  providers: [PostgresTransactionRepository, PostgresUserRepository],
  exports: [PostgresTransactionRepository, PostgresUserRepository],
})
export class PostgresModule {}
```

**PostgreSQL Entity:**

```typescript
// src/infrastructure/database/postgres/transaction/transaction.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['deposit', 'withdrawal', 'transfer'] })
  type: 'deposit' | 'withdrawal' | 'transfer';

  @Column({ type: 'enum', enum: ['pending', 'completed', 'failed'], default: 'pending' })
  status: 'pending' | 'completed' | 'failed';

  @CreateDateColumn()
  createdAt: Date;

  @Column('jsonb', { nullable: true })
  metadata: any;
}
```

**PostgreSQL Repository Implementation:**

```typescript
// src/infrastructure/database/postgres/transaction/postgres-transaction.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity as DomainTransactionEntity } from '../../../../core/entities/transaction/transaction.entity';
import { TransactionRepositoryAbstract } from '../../../../core/interfaces/repository/transaction/transaction-repository.interface';
import { TransactionEntity } from './transaction.entity';

@Injectable()
export class PostgresTransactionRepository extends TransactionRepositoryAbstract<DomainTransactionEntity> {
  constructor(
    @InjectRepository(TransactionEntity) 
    private transactionRepository: Repository<TransactionEntity>
  ) {
    super();
  }

  async findById(id: string): Promise<DomainTransactionEntity | null> {
    const transaction = await this.transactionRepository.findOne({
      where: { id }
    });
    
    if (!transaction) return null;
    
    return this.mapToEntity(transaction);
  }
  
  async findByUserId(userId: string): Promise<DomainTransactionEntity[]> {
    const transactions = await this.transactionRepository.find({
      where: { userId }
    });
    
    return transactions.map(transaction => this.mapToEntity(transaction));
  }

  async deposit(userId: string, amount: number, metadata?: any): Promise<DomainTransactionEntity> {
    const newTransaction = this.transactionRepository.create({
      userId,
      amount,
      type: 'deposit',
      status: 'completed',
      metadata
    });
    
    const savedTransaction = await this.transactionRepository.save(newTransaction);
    return this.mapToEntity(savedTransaction);
  }

  async withdraw(userId: string, amount: number, metadata?: any): Promise<DomainTransactionEntity> {
    const newTransaction = this.transactionRepository.create({
      userId,
      amount,
      type: 'withdrawal',
      status: 'completed',
      metadata
    });
    
    const savedTransaction = await this.transactionRepository.save(newTransaction);
    return this.mapToEntity(savedTransaction);
  }

  async transferFunds(fromUserId: string, toUserId: string, amount: number): Promise<DomainTransactionEntity> {
    const newTransaction = this.transactionRepository.create({
      userId: fromUserId,
      amount,
      type: 'transfer',
      status: 'completed',
      metadata: { toUserId }
    });
    
    const savedTransaction = await this.transactionRepository.save(newTransaction);
    return this.mapToEntity(savedTransaction);
  }
  
  async update(transaction: DomainTransactionEntity): Promise<DomainTransactionEntity> {
    const existingTransaction = await this.transactionRepository.findOne({
      where: { id: transaction.id }
    });
    
    if (!existingTransaction) {
      throw new NotFoundError('Transaction', transaction.id);
    }
    
    existingTransaction.status = transaction.status;
    existingTransaction.metadata = transaction.metadata;
    
    const updatedTransaction = await this.transactionRepository.save(existingTransaction);
    return this.mapToEntity(updatedTransaction);
  }
  
  private mapToEntity(ormEntity: TransactionEntity): DomainTransactionEntity {
    return new DomainTransactionEntity({
      id: ormEntity.id,
      userId: ormEntity.userId,
      amount: ormEntity.amount,
      type: ormEntity.type,
      status: ormEntity.status,
      createdAt: ormEntity.createdAt,
      metadata: ormEntity.metadata
    });
  }
}
```

### Redis Implementation

**Redis Module:**

```typescript
// src/infrastructure/database/redis/redis.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';
import { RedisTransactionRepository } from './transaction/redis-transaction.repository';
import { RedisUserRepository } from './user/redis-user.repository';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({
  imports: [
    NestRedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
          db: configService.get<number>('REDIS_DB', 0),
        },
      }),
    }),
  ],
  providers: [RedisTransactionRepository, RedisUserRepository],
  exports: [NestRedisModule, RedisTransactionRepository, RedisUserRepository],
})
export class RedisModule {}
```

**Redis Repository Implementation:**

```typescript
// src/infrastructure/database/redis/transaction/redis-transaction.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { TransactionEntity } from '../../../../core/entities/transaction/transaction.entity';
import { TransactionRepositoryAbstract } from '../../../../core/interfaces/repository/transaction/transaction-repository.interface';
import { REDIS_CLIENT } from '../redis.constants';

@Injectable()
export class RedisTransactionRepository extends TransactionRepositoryAbstract<TransactionEntity> {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis
  ) {
    super();
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const key = this.getKey(id);
    const transactionData = await this.redisClient.get(key);
    
    if (!transactionData) return null;
    
    return this.deserializeTransaction(transactionData);
  }
  
  async findByUserId(userId: string): Promise<TransactionEntity[]> {
    const userTransactionsKey = this.getUserTransactionsKey(userId);
    const transactionIds = await this.redisClient.smembers(userTransactionsKey);
    
    if (!transactionIds.length) return [];
    
    const transactionPromises = transactionIds.map(id => this.findById(id));
    const transactions = await Promise.all(transactionPromises);
    
    // Filter out any null values in case a transaction was deleted
    return transactions.filter(Boolean) as TransactionEntity[];
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
  
  async update(transaction: TransactionEntity): Promise<TransactionEntity> {
    const exists = await this.redisClient.exists(this.getKey(transaction.id));
    
    if (!exists) {
      throw new NotFoundError('Transaction', transaction.id);
    }
    
    await this.saveTransaction(transaction);
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
    const serialized = this.serializeTransaction(transaction);
    await this.redisClient.set(key, serialized);
  }
  
  private async addToUserTransactions(userId: string, transactionId: string): Promise<void> {
    const userTransactionsKey = this.getUserTransactionsKey(userId);
    await this.redisClient.sadd(userTransactionsKey, transactionId);
  }
  
  private serializeTransaction(transaction: TransactionEntity): string {
    return JSON.stringify({
      id: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      createdAt: transaction.createdAt.toISOString(),
      metadata: transaction.metadata
    });
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

### External Service Integration

**External Service Implementation:**

```typescript
// src/infrastructure/ext_services/payment-gateway/payment-gateway.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { PaymentGatewayInterface } from '../../../core/interfaces/service/payment-gateway/payment-gateway.interface';
import { BusinessRuleViolationError } from '../../../core/entities/error/domain-error.entity';

@Injectable()
export class PaymentGatewayService implements PaymentGatewayInterface {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async processPayment(amount: number, paymentDetails: any): Promise<any> {
    try {
      const apiKey = this.configService.get<string>('PAYMENT_API_KEY');
      const apiUrl = this.configService.get<string>('PAYMENT_API_URL');
      
      if (!apiKey || !apiUrl) {
        throw new Error('Payment gateway configuration is missing');
      }
      
      const response = await lastValueFrom(
        this.httpService.post(`${apiUrl}/payments`, {
          amount,
          ...paymentDetails
        }, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        })
      );
      
      return {
        paymentId: response.data.id,
        status: response.data.status,
        transactionId: response.data.transaction_id,
        timestamp: response.data.timestamp
      };
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400) {
          throw new BusinessRuleViolationError('Invalid payment request', data);
        } else if (status === 401 || status === 403) {
          throw new BusinessRuleViolationError('Payment authorization failed', data);
        } else if (status === 422) {
          throw new BusinessRuleViolationError('Payment processing failed', data);
        }
      }
      
      throw new BusinessRuleViolationError('Payment processing error', { message: error.message });
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const apiKey = this.configService.get<string>('PAYMENT_API_KEY');
      const apiUrl = this.configService.get<string>('PAYMENT_API_URL');
      
      const response = await lastValueFrom(
        this.httpService.get(`${apiUrl}/payments/${paymentId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        })
      );
      
      return {
        paymentId: response.data.id,
        status: response.data.status,
        transactionId: response.data.transaction_id,
        timestamp: response.data.timestamp
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      
      throw new BusinessRuleViolationError('Failed to retrieve payment status', { message: error.message });
    }
  }
}
```

---

This guide provides a foundation for implementing the Infrastructure Layer in a clean architecture microservice. By following these patterns and guidelines, you can create a robust, maintainable, and testable infrastructure layer that provides database and external service connectivity while respecting the dependency inversion principle. 