# Application Layer Guide

The Application Layer acts as a bridge between the Core (Domain) Layer and the outside world (UI, APIs, etc.). It orchestrates the flow of data between the domain and external layers, applying use cases without containing business rules.

## Table of Contents

- [Purpose](#purpose)
- [Components](#components)
  - [Application Services](#application-services)
  - [DTOs (Data Transfer Objects)](#dtos-data-transfer-objects)
  - [Error Management](#error-management)
  - [Mappers](#mappers)
- [Implementation Guidelines](#implementation-guidelines)
- [Integration with Other Layers](#integration-with-other-layers)
- [Examples](#examples)

## Purpose

The Application Layer serves these key purposes:

1. **Orchestration**: Coordinates domain services, entities, and external interfaces
2. **Use Case Implementation**: Implements specific application use cases
3. **Data Transformation**: Transforms domain objects to/from formats suitable for external consumption
4. **Cross-Cutting Concerns**: Handles authentication, logging, error handling, etc.
5. **Error Translation**: Converts domain errors into application-specific responses

## Components

### Application Services

Application services coordinate the execution of use cases, interacting with domain services and transforming data.

**Implementation Pattern:**

1. Create service classes that coordinate domain services
2. Keep business logic in the domain layer
3. Focus on orchestration and coordination
4. Handle cross-cutting concerns

**Example:**

```typescript
// src/application/services/transaction-application.service.ts
import { Injectable } from '@nestjs/common';
import { TransactionServiceAbstract } from '../../core/interfaces/service/transaction/transaction-service.interface';
import { UserServiceAbstract } from '../../core/interfaces/service/user/user-service.interface';
import { TransactionCreateDto } from '../dto/transaction/transaction-create.dto';
import { TransactionResponseDto } from '../dto/transaction/transaction-response.dto';
import { ErrorHandlerService } from '../error/error-handler.service';
import { NotFoundError, BusinessRuleViolationError } from '../../core/entities/error/domain-error.entity';

@Injectable()
export class TransactionApplicationService {
  constructor(
    private readonly transactionService: TransactionServiceAbstract,
    private readonly userService: UserServiceAbstract,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  async createTransaction(dto: TransactionCreateDto): Promise<TransactionResponseDto> {
    try {
      // Verify user exists
      const user = await this.userService.getUserById(dto.userId);
      if (!user) {
        throw new NotFoundError('User', dto.userId);
      }
      
      // Check if user is active
      if (!user.isActive) {
        throw new BusinessRuleViolationError('Cannot create transaction for inactive user');
      }
      
      // Delegate to domain service
      const transaction = await this.transactionService.createTransaction(
        dto.userId,
        dto.amount,
        dto.type,
        dto.metadata
      );
      
      // Transform domain entity to response DTO
      return {
        id: transaction.id,
        userId: transaction.userId,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        createdAt: transaction.createdAt.toISOString(),
        metadata: transaction.metadata
      };
    } catch (error) {
      // Error handling is centralized here
      this.errorHandler.handleError(error);
      throw error;
    }
  }

  async getTransactionById(id: string): Promise<TransactionResponseDto> {
    try {
      const transaction = await this.transactionService.getTransactionById(id);
      
      if (!transaction) {
        throw new NotFoundError('Transaction', id);
      }
      
      // Transform domain entity to response DTO
      return {
        id: transaction.id,
        userId: transaction.userId,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        createdAt: transaction.createdAt.toISOString(),
        metadata: transaction.metadata
      };
    } catch (error) {
      this.errorHandler.handleError(error);
      throw error;
    }
  }
  
  async processTransaction(id: string): Promise<TransactionResponseDto> {
    try {
      const transaction = await this.transactionService.processTransaction(id);
      
      // Transform domain entity to response DTO
      return {
        id: transaction.id,
        userId: transaction.userId,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        createdAt: transaction.createdAt.toISOString(),
        metadata: transaction.metadata
      };
    } catch (error) {
      this.errorHandler.handleError(error);
      throw error;
    }
  }
}
```

### DTOs (Data Transfer Objects)

DTOs define the structure of data exchanged between the application and external layers. They prevent domain entities from being exposed directly.

**Implementation Pattern:**

1. Create request and response DTOs
2. Use class-validator decorators for validation
3. Keep DTOs simple and focused
4. Organize by domain/feature

**Request DTO Example:**

```typescript
// src/application/dto/transaction/transaction-create.dto.ts
import { IsString, IsNumber, IsPositive, IsEnum, IsOptional, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class MetadataDto {
  @IsString()
  @IsOptional()
  toUserId?: string;
  
  @IsString()
  @IsOptional()
  description?: string;
  
  @IsString()
  @IsOptional()
  reference?: string;
}

export class TransactionCreateDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
  
  @IsNumber()
  @IsPositive()
  amount: number;
  
  @IsEnum(['deposit', 'withdrawal', 'transfer'])
  type: 'deposit' | 'withdrawal' | 'transfer';
  
  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;
}
```

**Response DTO Example:**

```typescript
// src/application/dto/transaction/transaction-response.dto.ts
export class TransactionResponseDto {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  metadata?: any;
}
```

### Error Management

Application-level error handling centralizes the management of errors from domain services and converts them to appropriate formats for external consumers.

**Implementation Pattern:**

1. Create a service for error handling
2. Map domain errors to application-specific responses
3. Add context like request paths, timestamps
4. Centralize logging and monitoring

**Error Handler Example:**

```typescript
// src/application/error/error-handler.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ErrorServiceAbstract } from '../../core/interfaces/service/error/error-service.interface';
import { DomainError } from '../../core/entities/error/domain-error.entity';
import { mapDomainErrorToResponse } from './error-mappers';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Injectable()
export class ErrorHandlerService {
  private readonly logger = new Logger(ErrorHandlerService.name);
  
  constructor(private readonly errorService: ErrorServiceAbstract) {}
  
  handleError(error: Error | DomainError, path?: string): ErrorResponseDto {
    // Let core service handle logging and monitoring
    this.errorService.handleError(error);
    
    // Add application-specific logging if needed
    this.logger.error(`Application error: ${error.message}`, error.stack);
    
    // Map to API response
    return mapDomainErrorToResponse(error, path);
  }
}
```

**Error DTO Example:**

```typescript
// src/application/dto/error-response.dto.ts
export class ErrorResponseDto {
  statusCode: number;
  code: string;
  message: string;
  details?: any;
  path?: string;
  timestamp?: string;
}
```

### Mappers

Mappers handle transformations between domain entities and DTOs, keeping the mapping logic centralized and reusable.

**Implementation Pattern:**

1. Create mapper functions for domain entities to/from DTOs
2. Keep mappers pure and focused
3. Organize mappers by domain concept
4. Reuse mappers across the application layer

**Error Mapper Example:**

```typescript
// src/application/error/error-mappers.ts
import { HttpStatus } from '@nestjs/common';
import { 
  DomainError, 
  ValidationError, 
  NotFoundError, 
  AuthorizationError, 
  BusinessRuleViolationError 
} from '../../core/entities/error/domain-error.entity';
import { ErrorResponseDto } from '../dto/error-response.dto';

export function mapDomainErrorToResponse(error: Error | DomainError, path?: string): ErrorResponseDto {
  const response: ErrorResponseDto = {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    path,
    timestamp: new Date().toISOString()
  };

  if (error instanceof ValidationError) {
    response.statusCode = HttpStatus.BAD_REQUEST;
    response.code = error.code;
    response.message = error.message;
    response.details = error.details;
  } else if (error instanceof NotFoundError) {
    response.statusCode = HttpStatus.NOT_FOUND;
    response.code = error.code;
    response.message = error.message;
  } else if (error instanceof AuthorizationError) {
    response.statusCode = HttpStatus.FORBIDDEN;
    response.code = error.code;
    response.message = error.message;
  } else if (error instanceof BusinessRuleViolationError) {
    response.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    response.code = error.code;
    response.message = error.message;
    response.details = error.details;
  } else if (error instanceof DomainError) {
    response.code = error.code;
    response.message = error.message;
    response.details = error.details;
  } else {
    // Keep default for unknown errors
    response.message = error.message || 'An unexpected error occurred';
  }

  return response;
}
```

**Transaction Mapper Example:**

```typescript
// src/application/transaction/transaction-mappers.ts
import { TransactionEntity } from '../../core/entities/transaction/transaction.entity';
import { TransactionResponseDto } from '../dto/transaction/transaction-response.dto';

export function mapTransactionToDto(transaction: TransactionEntity): TransactionResponseDto {
  return {
    id: transaction.id,
    userId: transaction.userId,
    amount: transaction.amount,
    type: transaction.type,
    status: transaction.status,
    createdAt: transaction.createdAt.toISOString(),
    metadata: transaction.metadata
  };
}
```

## Implementation Guidelines

When implementing the Application Layer, follow these guidelines:

1. **Thin Services**: Keep application services thin - they should mostly delegate to domain services
2. **Use Case Focus**: Organize application services around use cases, not entities
3. **No Business Logic**: Application services should not contain business logic
4. **DTO Validation**: Use class-validator decorators to validate DTOs
5. **Centralized Error Handling**: Handle errors consistently through the error handler
6. **Avoid Circular Dependencies**: Be careful not to create circular dependencies between layers
7. **Testing**: Write unit tests for mappers and integration tests for application services

## Integration with Other Layers

The Application Layer:

- **Depends on**: Core Layer (uses domain services and entities)
- **Is depended on by**: Server Layer (uses application services and DTOs)

Key integration points:

1. **Domain Services**: Application services use domain services from the Core Layer
2. **DTOs**: The Server Layer uses DTOs from the Application Layer
3. **Error Handling**: Application layer translates domain errors to API responses

## Examples

For complete examples of Application Layer implementations, see the following files in this template:

- Application services in `/src/application/service/*/*.service.ts`
- DTOs in `/src/application/dto/*/*.dto.ts`
- Error handling in `/src/application/error/error-handler.service.ts`
- Mappers in `/src/application/*/*-mappers.ts`

---

This guide provides a foundation for implementing the Application Layer in a clean architecture microservice. By following these patterns and guidelines, you can create a robust, maintainable, and testable orchestration layer that bridges your domain logic with external interfaces. 