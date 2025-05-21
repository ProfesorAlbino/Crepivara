# Server Layer Guide

The Server Layer (Presentation Layer) is responsible for handling external requests and presenting data to clients. It contains controllers, resolvers, gateways, and other components that expose your application's functionality via various protocols like HTTP, GraphQL, WebSockets, and gRPC.

## Table of Contents

- [Purpose](#purpose)
- [Components](#components)
  - [REST Controllers](#rest-controllers)
  - [GraphQL Resolvers](#graphql-resolvers)
  - [WebSocket Gateways](#websocket-gateways)
  - [gRPC Controllers](#grpc-controllers)
  - [Exception Filters](#exception-filters)
  - [Pipes](#pipes)
  - [Guards](#guards)
  - [Interceptors](#interceptors)
- [Implementation Guidelines](#implementation-guidelines)
- [Integration with Other Layers](#integration-with-other-layers)
- [Examples](#examples)
  - [REST Implementation](#rest-implementation)
  - [GraphQL Implementation](#graphql-implementation)
  - [WebSocket Implementation](#websocket-implementation)
  - [gRPC Implementation](#grpc-implementation)
  - [Global Exception Filter](#global-exception-filter)

## Purpose

The Server Layer serves these key purposes:

1. **Request Handling**: Processes incoming HTTP requests, GraphQL operations, WebSocket events, and gRPC calls
2. **Input Validation**: Validates and sanitizes incoming data
3. **Authentication & Authorization**: Verifies user identity and permissions
4. **Response Formatting**: Formats responses according to the protocol being used
5. **Error Handling**: Catches and formats errors for client consumption
6. **Documentation**: Provides API documentation via OpenAPI, GraphQL schema, etc.

## Components

### REST Controllers

REST controllers handle HTTP requests and return HTTP responses. They define routes, parse request data, and invoke application services.

**Implementation Pattern:**

1. Create controller classes decorated with `@Controller`
2. Define route handlers with HTTP method decorators (`@Get`, `@Post`, etc.)
3. Extract data from requests using parameter decorators (`@Body`, `@Param`, etc.)
4. Use application services to process requests
5. Return responses that will be serialized to JSON

### GraphQL Resolvers

GraphQL resolvers handle GraphQL queries, mutations, and subscriptions. They define the mapping between GraphQL operations and application logic.

**Implementation Pattern:**

1. Create resolver classes decorated with `@Resolver`
2. Define query handlers with `@Query` decorator
3. Define mutation handlers with `@Mutation` decorator
4. Define subscription handlers with `@Subscription` decorator
5. Use application services to process operations
6. Return responses that match GraphQL types

### WebSocket Gateways

WebSocket gateways handle real-time communication via WebSockets. They define message handlers, manage connections, and emit events.

**Implementation Pattern:**

1. Create gateway classes decorated with `@WebSocketGateway`
2. Define message handlers with `@SubscribeMessage` decorator
3. Use the `@WebSocketServer` decorator to access the server instance
4. Implement connection lifecycle hooks (`OnGatewayConnection`, `OnGatewayDisconnect`)
5. Use application services to process messages
6. Emit events to clients using the server instance

### gRPC Controllers

gRPC controllers handle gRPC remote procedure calls. They define the mapping between gRPC service methods and application logic.

**Implementation Pattern:**

1. Create controller classes decorated with `@Controller`
2. Define method handlers with `@GrpcMethod` decorator
3. Map between protocol buffer types and application DTOs
4. Use application services to process calls
5. Return responses that match protocol buffer message types

### Exception Filters

Exception filters catch exceptions thrown from your application and convert them to appropriate responses for the client.

**Implementation Pattern:**

1. Create filter classes that implement the `ExceptionFilter` interface
2. Handle specific types of exceptions
3. Convert exceptions to appropriate responses
4. Apply filters globally or to specific controllers/routes

### Pipes

Pipes transform input data. They validate, sanitize, or transform data before it reaches route handlers.

**Implementation Pattern:**

1. Create pipe classes that implement the `PipeTransform` interface
2. Validate or transform input data
3. Apply pipes globally, to controllers, to routes, or to parameters

### Guards

Guards determine if a request should be handled by a route handler. They often perform authentication and authorization checks.

**Implementation Pattern:**

1. Create guard classes that implement the `CanActivate` interface
2. Perform security checks
3. Return true to allow the request, false to deny it
4. Apply guards globally, to controllers, or to routes

### Interceptors

Interceptors add extra logic before and after route handlers. They can modify requests, responses, or handle errors.

**Implementation Pattern:**

1. Create interceptor classes that implement the `NestInterceptor` interface
2. Add logic to run before and/or after route handlers
3. Transform requests, responses, or handle errors
4. Apply interceptors globally, to controllers, or to routes

## Implementation Guidelines

When implementing the Server Layer, follow these guidelines:

1. **Thin Controllers**: Keep controllers thin - they should delegate to application services
2. **Input Validation**: Validate all input data using DTOs with validation decorators
3. **Error Handling**: Use exception filters to handle errors uniformly
4. **Authentication**: Use guards for authentication and authorization
5. **Versioning**: Consider API versioning for REST APIs
6. **Documentation**: Add OpenAPI/Swagger annotations for REST APIs
7. **Testing**: Write integration tests for all endpoints
8. **Logging**: Log request/response details for debugging

## Integration with Other Layers

The Server Layer:

- **Depends on**: Application Layer (uses application services and DTOs)
- **Is depended on by**: Nothing (it's the outermost layer)

Key integration points:

1. **Application Services**: Server-side controllers/resolvers call application services
2. **DTOs**: The server layer uses DTOs from the application layer
3. **Error Handling**: The server layer uses the application error handler

## Examples

### REST Implementation

**REST Controller:**

```typescript
// src/server/rest/controller/transaction/transaction-controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { TransactionApplicationService } from '../../../../application/services/transaction-application.service';
import { TransactionCreateDto } from '../../../../application/dto/transaction/transaction-create.dto';
import { TransactionResponseDto } from '../../../../application/dto/transaction/transaction-response.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionApplicationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Transaction created successfully', 
    type: TransactionResponseDto 
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation error' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async createTransaction(@Body() createTransactionDto: TransactionCreateDto): Promise<TransactionResponseDto> {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Transaction retrieved successfully', 
    type: TransactionResponseDto 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async getTransaction(@Param('id') id: string): Promise<TransactionResponseDto> {
    return this.transactionService.getTransactionById(id);
  }

  @Post(':id/process')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process a pending transaction' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Transaction processed successfully', 
    type: TransactionResponseDto 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Transaction cannot be processed' })
  async processTransaction(@Param('id') id: string): Promise<TransactionResponseDto> {
    return this.transactionService.processTransaction(id);
  }
}
```

**REST Module Registration:**

```typescript
// src/server/rest/rest.module.ts
import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../application/application.module';
import { TransactionController } from './controller/transaction/transaction-controller';
import { UserController } from './controller/user/user-controller';
import { AuthController } from './controller/auth/auth-controller';

@Module({
  imports: [ApplicationModule],
  controllers: [
    TransactionController,
    UserController,
    AuthController
  ],
})
export class RestModule {}
```

**Server Module with REST:**

```typescript
// src/server/server.module.ts
import { Module } from '@nestjs/common';
import { RestModule } from './rest/rest.module';
import { GraphqlModule } from './graphql/graphql.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    RestModule,
    GraphqlModule,
    WebsocketModule,
  ],
})
export class ServerModule {}
```

### GraphQL Implementation

**GraphQL Resolver:**

```typescript
// src/server/graphql/resolver/transaction-resolver.ts
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TransactionApplicationService } from '../../../application/services/transaction-application.service';
import { TransactionCreateDto } from '../../../application/dto/transaction/transaction-create.dto';
import { TransactionResponseDto } from '../../../application/dto/transaction/transaction-response.dto';
import { GqlAuthGuard } from '../guard/gql-auth.guard';

@Resolver('Transaction')
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionApplicationService) {}

  @Query('getTransaction')
  @UseGuards(GqlAuthGuard)
  async getTransaction(@Args('id') id: string, @Context() context: any): Promise<TransactionResponseDto> {
    return this.transactionService.getTransactionById(id);
  }

  @Mutation('createTransaction')
  @UseGuards(GqlAuthGuard)
  async createTransaction(
    @Args('input') input: TransactionCreateDto,
    @Context() context: any
  ): Promise<TransactionResponseDto> {
    return this.transactionService.createTransaction(input);
  }

  @Mutation('processTransaction')
  @UseGuards(GqlAuthGuard)
  async processTransaction(
    @Args('id') id: string,
    @Context() context: any
  ): Promise<TransactionResponseDto> {
    return this.transactionService.processTransaction(id);
  }
}
```

**GraphQL Schema:**

```graphql
# src/server/graphql/schema.graphql
scalar Date
scalar JSON

type Transaction {
  id: ID!
  userId: String!
  amount: Float!
  type: TransactionType!
  status: TransactionStatus!
  createdAt: Date!
  metadata: JSON
}

enum TransactionType {
  DEPOSIT
  WITHDRAWAL
  TRANSFER
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
}

input TransactionCreateInput {
  userId: String!
  amount: Float!
  type: TransactionType!
  metadata: JSON
}

type Query {
  getTransaction(id: ID!): Transaction
}

type Mutation {
  createTransaction(input: TransactionCreateInput!): Transaction
  processTransaction(id: ID!): Transaction
}
```

**GraphQL Module Registration:**

```typescript
// src/server/graphql/graphql.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TransactionResolver } from './resolver/transaction-resolver';
import { UserResolver } from './resolver/user-resolver';
import { AuthResolver } from './resolver/auth-resolver';
import { ApplicationModule } from '../../application/application.module';

@Module({
  imports: [
    ApplicationModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/server/graphql/graphql.schema.ts'),
      },
      context: ({ req }) => ({ req }),
    }),
  ],
  providers: [
    TransactionResolver,
    UserResolver,
    AuthResolver,
  ],
})
export class GraphqlModule {}
```

### WebSocket Implementation

**WebSocket Gateway:**

```typescript
// src/server/websocket/gateway/transaction-gateway.ts
import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  WsResponse 
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { TransactionApplicationService } from '../../../application/services/transaction-application.service';
import { TransactionCreateDto } from '../../../application/dto/transaction/transaction-create.dto';
import { WsAuthGuard } from '../guard/ws-auth.guard';

@WebSocketGateway({ cors: true })
export class TransactionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly transactionService: TransactionApplicationService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('createTransaction')
  async handleCreateTransaction(client: Socket, payload: TransactionCreateDto): Promise<WsResponse<any>> {
    const transaction = await this.transactionService.createTransaction(payload);
    
    // Emit to all clients
    this.server.emit('transactionCreated', transaction);
    
    return { event: 'transactionCreated', data: transaction };
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('processTransaction')
  async handleProcessTransaction(client: Socket, payload: { id: string }): Promise<WsResponse<any>> {
    const transaction = await this.transactionService.processTransaction(payload.id);
    
    // Emit to all clients
    this.server.emit('transactionUpdated', transaction);
    
    return { event: 'transactionUpdated', data: transaction };
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getTransaction')
  async handleGetTransaction(client: Socket, payload: { id: string }): Promise<WsResponse<any>> {
    const transaction = await this.transactionService.getTransactionById(payload.id);
    return { event: 'transaction', data: transaction };
  }
}
```

**WebSocket Module Registration:**

```typescript
// src/server/websocket/websocket.module.ts
import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../application/application.module';
import { TransactionGateway } from './gateway/transaction-gateway';
import { UserGateway } from './gateway/user-gateway';
import { WsAuthGuard } from './guard/ws-auth.guard';

@Module({
  imports: [ApplicationModule],
  providers: [
    TransactionGateway,
    UserGateway,
    WsAuthGuard,
  ],
})
export class WebsocketModule {}
```

### gRPC Implementation

**Protocol Definition:**

```protobuf
// src/server/grpc/proto/transaction.proto
syntax = "proto3";

package transaction;

service TransactionService {
  rpc CreateTransaction (CreateTransactionRequest) returns (Transaction);
  rpc GetTransaction (GetTransactionRequest) returns (Transaction);
  rpc ProcessTransaction (ProcessTransactionRequest) returns (Transaction);
}

message CreateTransactionRequest {
  string userId = 1;
  double amount = 2;
  string type = 3;
  string metadata = 4;
}

message GetTransactionRequest {
  string id = 1;
}

message ProcessTransactionRequest {
  string id = 1;
}

message Transaction {
  string id = 1;
  string userId = 2;
  double amount = 3;
  string type = 4;
  string status = 5;
  string createdAt = 6;
  string metadata = 7;
}
```

**gRPC Service:**

```typescript
// src/server/grpc/service/transaction-service.ts
import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TransactionApplicationService } from '../../../application/services/transaction-application.service';
import { GrpcAuthGuard } from '../guard/grpc-auth.guard';
import { ErrorHandlerService } from '../../../application/error/error-handler.service';

@Controller()
export class TransactionGrpcService {
  constructor(
    private readonly transactionService: TransactionApplicationService,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('TransactionService', 'CreateTransaction')
  async createTransaction(data: any): Promise<any> {
    try {
      const transaction = await this.transactionService.createTransaction({
        userId: data.userId,
        amount: data.amount,
        type: data.type.toLowerCase(),
        metadata: data.metadata ? JSON.parse(data.metadata) : undefined
      });
      
      return {
        id: transaction.id,
        userId: transaction.userId,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        createdAt: transaction.createdAt,
        metadata: transaction.metadata ? JSON.stringify(transaction.metadata) : ''
      };
    } catch (error) {
      this.errorHandler.handleError(error);
      throw error;
    }
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('TransactionService', 'GetTransaction')
  async getTransaction(data: { id: string }): Promise<any> {
    try {
      const transaction = await this.transactionService.getTransactionById(data.id);
      
      return {
        id: transaction.id,
        userId: transaction.userId,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        createdAt: transaction.createdAt,
        metadata: transaction.metadata ? JSON.stringify(transaction.metadata) : ''
      };
    } catch (error) {
      this.errorHandler.handleError(error);
      throw error;
    }
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('TransactionService', 'ProcessTransaction')
  async processTransaction(data: { id: string }): Promise<any> {
    try {
      const transaction = await this.transactionService.processTransaction(data.id);
      
      return {
        id: transaction.id,
        userId: transaction.userId,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        createdAt: transaction.createdAt,
        metadata: transaction.metadata ? JSON.stringify(transaction.metadata) : ''
      };
    } catch (error) {
      this.errorHandler.handleError(error);
      throw error;
    }
  }
}
```

**gRPC Module Registration:**

```typescript
// src/server/grpc/grpc.module.ts
import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../application/application.module';
import { TransactionGrpcService } from './service/transaction-service';
import { UserGrpcService } from './service/user-service';
import { GrpcAuthGuard } from './guard/grpc-auth.guard';

@Module({
  imports: [ApplicationModule],
  controllers: [
    TransactionGrpcService,
    UserGrpcService,
  ],
  providers: [GrpcAuthGuard],
})
export class GrpcModule {}
```

**Main.ts gRPC Configuration:**

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { HttpExceptionFilter } from './server/filter/http-exception-filter';
import { ErrorHandlerService } from './application/error/error-handler.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get error handler from application context
  const errorHandler = app.get(ErrorHandlerService);
  
  // Apply global exception filter
  app.useGlobalFilters(new HttpExceptionFilter(errorHandler));
  
  // Create gRPC microservice
  const grpcApp = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'transaction',
      protoPath: join(__dirname, 'server/grpc/proto/transaction.proto'),
      url: process.env.GRPC_URL || '0.0.0.0:5000',
    },
  });
  
  await app.listen(process.env.PORT || 3000);
  await grpcApp.listen();
  
  console.log(`Application running on ${await app.getUrl()}`);
}
bootstrap();
```

### Global Exception Filter

**HTTP Exception Filter:**

```typescript
// src/server/filter/http-exception-filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorHandlerService } from '../../application/error/error-handler.service';
import { DomainError } from '../../core/entities/error/domain-error.entity';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorHandler: ErrorHandlerService) {}

  catch(exception: Error | HttpException | DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let errorResponse;
    
    if (exception instanceof HttpException) {
      // Handle NestJS HTTP exceptions
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      errorResponse = {
        statusCode: status,
        code: 'HTTP_ERROR',
        message: typeof exceptionResponse === 'object' && 'message' in exceptionResponse 
          ? exceptionResponse['message'] 
          : exception.message,
        path: request.url,
        timestamp: new Date().toISOString()
      };
    } else {
      // Handle domain errors or unexpected errors
      errorResponse = this.errorHandler.handleError(exception, request.url);
    }
    
    response
      .status(errorResponse.statusCode)
      .json(errorResponse);
  }
}
```

---

This guide provides a foundation for implementing the Server Layer in a clean architecture microservice. By following these patterns and guidelines, you can create a robust, maintainable, and testable presentation layer that exposes your application's functionality through various protocols while keeping concerns properly separated.