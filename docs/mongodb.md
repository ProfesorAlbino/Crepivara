# MongoDB Implementation Guide

This document provides details on how to implement MongoDB repositories for the NestJS microservice template.

## Setup

### 1. Configure MongoDB Connection

Make sure the MongoDB module is imported in your `infrastructure.module.ts`:

```typescript
// src/infrastructure/infrastructure.module.ts
@Module({
  imports: [
    MongodbModule,
    // other database modules...
  ],
  // ...
})
```

### 2. Create Mongoose Schemas

Define your MongoDB schemas in the corresponding module:

```typescript
// src/infrastructure/database/mongodb/transaction/transaction.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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

### 3. Implement Repository

Create your MongoDB repository implementation:

```typescript
// src/infrastructure/database/mongodb/transaction/mongodb-transaction.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionRepositoryAbstract } from '../../../../core/interfaces/repository/transaction/transaction-repository.interface';
import { TransactionEntity } from '../../../../core/entities/transaction/transaction.entity';
import { Transaction, TransactionDocument } from './transaction.schema';

@Injectable()
export class MongodbTransactionRepository extends TransactionRepositoryAbstract<TransactionEntity> {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<TransactionDocument>
  ) {
    super();
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) return null;
    
    return this.mapToEntity(transaction);
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

### 4. Configure MongoDB Module

Set up the MongoDB module:

```typescript
// src/infrastructure/database/mongodb/mongodb.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Transaction, TransactionSchema } from './transaction/transaction.schema';
import { MongodbTransactionRepository } from './transaction/mongodb-transaction.repository';

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
    ]),
  ],
  providers: [MongodbTransactionRepository],
  exports: [MongodbTransactionRepository],
})
export class MongodbModule {}
```

## Usage

To use MongoDB as your database, update the `infrastructure.module.ts` to use the MongoDB implementation:

```typescript
@Module({
  imports: [
    MongodbModule,
    // Comment out other database modules
    // PostgresModule,
    // RedisModule,
  ],
  providers: [
    {
      provide: TransactionRepositoryAbstract,
      // Choose which implementation to use
      useExisting: MongodbTransactionRepository
      // Comment out other implementations
      // useExisting: PostgresTransactionRepository
      // useExisting: RedisTransactionRepository
    }
  ],
  exports: [MongodbModule, TransactionRepositoryAbstract]
})
export class InfrastructureModule {} 