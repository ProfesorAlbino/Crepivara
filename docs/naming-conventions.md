# Naming Conventions

This document outlines the naming conventions for files, directories, classes, interfaces, and other components in our microservice architecture.

## Table of Contents

- [Directory and File Structure](#directory-and-file-structure)
- [Classes and Interfaces](#classes-and-interfaces)
- [Methods and Functions](#methods-and-functions)
- [Variables and Constants](#variables-and-constants)
- [Module Organization](#module-organization)

## Directory and File Structure

### Directory Naming

- All directories should use **kebab-case** (lowercase with hyphens)
- Domain-specific directories should be named after the domain entity they represent
- Utility or shared directories should have descriptive names

Example:
```
src/
├── core/
│   ├── entities/
│   │   ├── transaction/
│   │   └── user/
│   ├── interfaces/
│   │   ├── repository/
│   │   └── service/
│   └── services/
├── application/
│   ├── dto/
│   │   ├── transaction/
│   │   └── user/
│   ├── error/
│   └── services/
├── infrastructure/
│   ├── database/
│   │   ├── mongodb/
│   │   ├── postgres/
│   │   └── redis/
│   └── ext-services/
└── server/
    ├── rest/
    ├── graphql/
    ├── websocket/
    └── grpc/
```

### File Naming

- All files should use **kebab-case** (lowercase with hyphens)
- Files should have a suffix indicating their type/role
- Related files should be grouped in domain-specific directories

File naming patterns by type:

| Type | Pattern | Example |
|------|---------|---------|
| Entity | `[entity-name].entity.ts` | `transaction.entity.ts` |
| Repository Interface | `[entity-name]-repository.interface.ts` | `transaction-repository.interface.ts` |
| Service Interface | `[entity-name]-service.interface.ts` | `transaction-service.interface.ts` |
| Service Implementation | `[entity-name].service.ts` | `transaction.service.ts` |
| Controller | `[entity-name]-controller.ts` | `transaction-controller.ts` |
| DTO | `[entity-name]-[operation].dto.ts` | `transaction-create.dto.ts` |
| Module | `[module-name].module.ts` | `transaction.module.ts` |
| GraphQL Resolver | `[entity-name]-resolver.ts` | `transaction-resolver.ts` |
| WebSocket Gateway | `[entity-name]-gateway.ts` | `transaction-gateway.ts` |
| gRPC Service | `[entity-name]-service.ts` | `transaction-service.ts` |

## Classes and Interfaces

### Interfaces and Abstract Classes

- Use **PascalCase** (capitalize first letter of each word)
- Abstract classes should have the suffix `Abstract`
- Repository interfaces should have the suffix `RepositoryAbstract`
- Service interfaces should have the suffix `ServiceAbstract`

Examples:
```typescript
// Repository interface
export abstract class TransactionRepositoryAbstract<T extends TransactionEntity> {
  abstract findById(id: string): Promise<T | null>;
  // ...
}

// Service interface
export abstract class TransactionServiceAbstract {
  abstract createTransaction(userId: string, amount: number, type: string): Promise<TransactionEntity>;
  // ...
}
```

### Implementation Classes

- Use **PascalCase**
- Class names should be descriptive and indicate their role
- Repository implementations should have the name pattern: `[Database][Entity]Repository`
- Service implementations should have the name pattern: `[Entity]Service`
- Controllers should have the name pattern: `[Entity]Controller`
- DTOs should have the name pattern: `[Entity][Operation]Dto`

Examples:
```typescript
// Repository implementation
export class MongodbTransactionRepository extends TransactionRepositoryAbstract<TransactionEntity> {
  // ...
}

// Service implementation
export class TransactionService extends TransactionServiceAbstract {
  // ...
}

// Controller
export class TransactionController {
  // ...
}

// DTO
export class TransactionCreateDto {
  // ...
}
```

## Methods and Functions

- Use **camelCase** (lowercase first letter, capitalize subsequent words)
- Method names should be verbs or verb phrases
- Methods should clearly indicate their action or purpose
- Boolean-returning methods should be prefixed with `is`, `has`, `can`, etc.

Examples:
```typescript
// Methods in a service
async createTransaction(): Promise<TransactionEntity> { /* ... */ }
async getTransactionById(id: string): Promise<TransactionEntity> { /* ... */ }
async processTransaction(id: string): Promise<TransactionEntity> { /* ... */ }

// Boolean methods
isPending(): boolean { /* ... */ }
hasEnoughFunds(amount: number): boolean { /* ... */ }
```

## Variables and Constants

- Use **camelCase** for variables and function parameters
- Use **UPPER_SNAKE_CASE** for global constants and environment variables
- Boolean variables should be prefixed with `is`, `has`, `can`, etc.
- Use descriptive names that clearly indicate the variable's purpose

Examples:
```typescript
// Variables
const userId = '123';
const transactionAmount = 100;
const isProcessed = true;

// Constants
const MAX_TRANSACTION_AMOUNT = 10000;
const DEFAULT_PAGE_SIZE = 20;
```

## Module Organization

- Domain modules should be organized by feature/domain
- Each module should have a dedicated directory
- Module files should be located at the root of their directory
- Each module should have a clear responsibility adhering to the Single Responsibility Principle

Examples:
```typescript
// Core module
@Module({
  imports: [InfrastructureModule],
  providers: [
    {
      provide: TransactionServiceAbstract,
      useClass: TransactionService
    },
    {
      provide: ErrorServiceAbstract,
      useClass: ErrorService
    }
  ],
  exports: [TransactionServiceAbstract, ErrorServiceAbstract],
})
export class CoreModule {}

// Infrastructure module
@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: TransactionRepositoryAbstract,
      useExisting: RedisTransactionRepository
    }
  ],
  exports: [RedisModule, TransactionRepositoryAbstract]
})
export class InfrastructureModule {}
```

## DTOs Naming Convention

DTOs follow a specialized naming convention:

1. DTOs should be named with the pattern: `[Entity][Operation]Dto`
2. Common DTO operations include: `Create`, `Update`, `Response`, `List`, etc.

Examples:
```typescript
// DTOs
export class TransactionCreateDto { /* ... */ }
export class TransactionUpdateDto { /* ... */ }
export class TransactionResponseDto { /* ... */ }
export class TransactionListDto { /* ... */ }
```

## Error Classes

Error-related classes follow these conventions:

1. All domain errors extend a base `DomainError` class
2. Error class names should be descriptive of the error type and end with `Error`

Examples:
```typescript
// Base domain error
export class DomainError extends Error { /* ... */ }

// Specific error types
export class ValidationError extends DomainError { /* ... */ }
export class NotFoundError extends DomainError { /* ... */ }
export class BusinessRuleViolationError extends DomainError { /* ... */ }
```

## Clean Architecture Layer-specific Conventions

### Core Layer

- Domain entities: `[Entity].entity.ts`
- Domain services: `[Entity].service.ts`
- Service interfaces: `[Entity]-service.interface.ts`
- Repository interfaces: `[Entity]-repository.interface.ts`

### Application Layer

- Application services: `[Entity]-application.service.ts`
- DTOs: `[Entity]-[operation].dto.ts`
- Error handlers: `error-handler.service.ts`

### Infrastructure Layer

- Database repositories: `[Database]-[entity].repository.ts`
- External services: `[service-name].service.ts`
- Database modules: `[database].module.ts`

### Server Layer

- REST controllers: `[Entity]-controller.ts`
- GraphQL resolvers: `[Entity]-resolver.ts`
- WebSocket gateways: `[Entity]-gateway.ts`
- gRPC services: `[Entity]-service.ts`
- Exception filters: `http-exception-filter.ts`

---

Adhering to these naming conventions ensures consistency across the codebase and makes it easier for team members to navigate and understand the project structure. 