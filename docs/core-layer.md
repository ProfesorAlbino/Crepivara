# Core Layer Guide

The Core Layer (Domain Layer) is the heart of the clean architecture implementation. It contains all business logic and domain entities, completely isolated from external concerns like databases, APIs, or UI.

## Table of Contents

- [Purpose](#purpose)
- [Components](#components)
  - [Domain Entities](#domain-entities)
  - [Domain Services](#domain-services)
  - [Repository Interfaces](#repository-interfaces)
  - [Domain Errors](#domain-errors)
- [Implementation Guidelines](#implementation-guidelines)
- [Integration with Other Layers](#integration-with-other-layers)
- [Examples](#examples)

## Purpose

The Core Layer serves these key purposes:

1. **Encapsulate Business Logic**: All business rules and logic reside here, independent of external concerns
2. **Define Domain Model**: Represents the problem domain with clear entities and value objects
3. **Establish Interfaces**: Defines ports that other layers must implement (database repositories, external services)
4. **Ensure Business Rule Validation**: Contains validation logic to enforce business rules

## Components

### Domain Entities

Domain entities are objects that have distinct identities and lifecycles. They embody the state and behavior of your business domain.

**Implementation Pattern:**

1. Create a base class for common entity logic (optional)
2. Use plain TypeScript classes - no decorators from external frameworks
3. Implement business logic methods directly on the entity
4. Use factories for complex entity creation

**Example:**

```typescript
// src/core/entities/transaction/transaction.entity.ts
export class TransactionEntity {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  metadata?: any;

  constructor(partial: Partial<TransactionEntity>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
  }

  // Domain logic methods
  isPositiveAmount(): boolean {
    return this.amount > 0;
  }

  isPending(): boolean {
    return this.status === 'pending';
  }
  
  isCompleted(): boolean {
    return this.status === 'completed';
  }
  
  canBeProcessed(): boolean {
    return this.isPending() && this.isPositiveAmount();
  }

  markAsCompleted(): void {
    if (!this.isPending()) {
      throw new Error('Only pending transactions can be completed');
    }
    this.status = 'completed';
  }
  
  markAsFailed(reason?: string): void {
    if (!this.isPending()) {
      throw new Error('Only pending transactions can be marked as failed');
    }
    this.status = 'failed';
    if (reason) {
      this.metadata = { ...this.metadata, failureReason: reason };
    }
  }
}
```

### Domain Services

Domain services implement business logic that doesn't naturally fit into entities. They operate on multiple entities or perform complex domain operations.

**Implementation Pattern:**

1. Define an abstract class or interface for the service
2. Create a concrete implementation
3. Keep the service focused on business logic - no infrastructure or external dependencies
4. Inject repository interfaces (not implementations)

**Interface Example:**

```typescript
// src/core/interfaces/service/transaction/transaction-service.interface.ts
import { TransactionEntity } from '../../../entities/transaction/transaction.entity';

export abstract class TransactionServiceAbstract {
  abstract createTransaction(
    userId: string,
    amount: number,
    type: 'deposit' | 'withdrawal' | 'transfer',
    metadata?: any
  ): Promise<TransactionEntity>;
  
  abstract processTransaction(id: string): Promise<TransactionEntity>;
  
  abstract getTransactionById(id: string): Promise<TransactionEntity | null>;
  
  abstract getTransactionsByUserId(userId: string): Promise<TransactionEntity[]>;
}
```

**Implementation Example:**

```typescript
// src/core/services/transaction/transaction.service.ts
import { Injectable } from '@nestjs/common';
import { TransactionServiceAbstract } from '../../interfaces/service/transaction/transaction-service.interface';
import { TransactionRepositoryAbstract } from '../../interfaces/repository/transaction/transaction-repository.interface';
import { TransactionEntity } from '../../entities/transaction/transaction.entity';
import { 
  BusinessRuleViolationError, 
  NotFoundError 
} from '../../entities/error/domain-error.entity';
import { ErrorServiceAbstract } from '../../interfaces/service/error/error-service.interface';

@Injectable()
export class TransactionService extends TransactionServiceAbstract {
  constructor(
    private readonly transactionRepository: TransactionRepositoryAbstract<TransactionEntity>,
    private readonly errorService: ErrorServiceAbstract
  ) {
    super();
  }

  async createTransaction(
    userId: string, 
    amount: number, 
    type: 'deposit' | 'withdrawal' | 'transfer',
    metadata?: any
  ): Promise<TransactionEntity> {
    try {
      // Business rule validation
      if (amount <= 0) {
        throw new BusinessRuleViolationError('Transaction amount must be greater than zero');
      }

      // Domain logic processing based on transaction type
      if (type === 'deposit') {
        return this.transactionRepository.deposit(userId, amount, metadata);
      } else if (type === 'withdrawal') {
        return this.transactionRepository.withdraw(userId, amount, metadata);
      } else if (type === 'transfer' && metadata?.toUserId) {
        return this.transactionRepository.transferFunds(userId, metadata.toUserId, amount);
      } else {
        throw new BusinessRuleViolationError('Invalid transaction type or missing required metadata');
      }
    } catch (error) {
      this.errorService.handleError(error);
      throw error;
    }
  }
  
  async processTransaction(id: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findById(id);
    
    if (!transaction) {
      throw new NotFoundError('Transaction', id);
    }
    
    if (!transaction.isPending()) {
      throw new BusinessRuleViolationError(
        `Transaction cannot be processed because it is already ${transaction.status}`
      );
    }
    
    // Process transaction logic...
    transaction.markAsCompleted();
    
    // Save the updated transaction
    return this.transactionRepository.update(transaction);
  }
  
  async getTransactionById(id: string): Promise<TransactionEntity | null> {
    return this.transactionRepository.findById(id);
  }
  
  async getTransactionsByUserId(userId: string): Promise<TransactionEntity[]> {
    return this.transactionRepository.findByUserId(userId);
  }
}
```

### Repository Interfaces

Repository interfaces define contracts that infrastructure implementations must fulfill to persist and retrieve domain entities.

**Implementation Pattern:**

1. Define abstract classes with generic type parameters
2. Focus on domain concepts, not database operations
3. Use domain terminology in method names
4. Hide persistence details from the domain

**Example:**

```typescript
// src/core/interfaces/repository/transaction/transaction-repository.interface.ts
import { TransactionEntity } from '../../../entities/transaction/transaction.entity';

export abstract class TransactionRepositoryAbstract<T extends TransactionEntity> {
  abstract findById(id: string): Promise<T | null>;
  abstract findByUserId(userId: string): Promise<T[]>;
  abstract deposit(userId: string, amount: number, metadata?: any): Promise<T>;
  abstract withdraw(userId: string, amount: number, metadata?: any): Promise<T>;
  abstract transferFunds(fromUserId: string, toUserId: string, amount: number): Promise<T>;
  abstract update(transaction: T): Promise<T>;
}
```

### Domain Errors

Domain errors are exceptions that are specific to the domain and should not be handled by external layers.

**Implementation Pattern:**

1. Create a base class for domain errors
2. Use plain TypeScript classes - no decorators from external frameworks
3. Implement business logic methods directly on the entity
4. Use factories for complex entity creation

**Example:**

```typescript
// src/core/entities/error/domain-error.entity.ts
export class BusinessRuleViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleViolationError';
  }
}

export class NotFoundError extends Error {
  constructor(entityName: string, id: string) {
    super(`${entityName} not found with id: ${id}`);
    this.name = 'NotFoundError';
  }
}
```