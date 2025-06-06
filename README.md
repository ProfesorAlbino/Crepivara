<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJS Microservice Template

A comprehensive NestJS microservice template implementing clean architecture principles with support for multiple communication protocols and database types.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Core Layer](#core-layer)
- [Application Layer](#application-layer)
- [Infrastructure Layer](#infrastructure-layer)
- [Server Layer](#server-layer)
- [Environment Configuration](#environment-configuration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)

## Architecture Overview

This template follows clean architecture principles with a clear separation of concerns:

```
src/
├── core/           # Domain layer (business logic)
├── application/    # Application layer (use cases, orchestration)
├── infrastructure/ # Infrastructure layer (external services, databases)
├── server/         # Presentation layer (REST, GraphQL, WebSockets, gRPC)
└── main.ts         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Docker and Docker Compose (for local development with databases)

### Installation

1. Clone this repository:

```bash
git clone <repository-url>
cd microservice-nestjs-template
```

2. Install dependencies (if not using Docker):

```bash
npm install
```

3. Run the application (if not using Docker):

```bash
npm run start:dev
```

4. If you have Docker and don't wanna perform steps above, start development environment with Docker Compose:

```bash
docker-compose up --build
```

## Core Layer

The core layer contains all domain-specific business logic and is independent of external services, frameworks, and databases.

For detailed documentation on the Core Layer, including domain entities, services, interfaces, and error handling, see the [Core Layer Documentation](./docs/core-layer.md).

## Application Layer

The application layer orchestrates interactions between the domain layer and external interfaces. It contains use cases, DTOs, and application-specific services.

For detailed documentation on the Application Layer, including application services, DTOs, and error handling, see the [Application Layer Documentation](./docs/application-layer.md).

## Infrastructure Layer

The infrastructure layer implements integrations with external systems, databases, and services.

For detailed documentation on the Infrastructure Layer, including different database implementations, see the [Infrastructure Layer Documentation](./docs/infrastructure-layer.md).

For specific database implementations, see:
- [MongoDB Documentation](./docs/mongodb.md)
- [PostgreSQL Documentation](./docs/postgres.md)
- [Redis Documentation](./docs/redis.md)

## Server Layer

The server layer contains all the API endpoints and handlers for different communication protocols.

For detailed documentation on the Server Layer, including REST controllers, GraphQL resolvers, WebSockets, and gRPC services, see the [Server Layer Documentation](./docs/server-layer.md).

## Environment Configuration

This template uses NestJS's ConfigModule for environment configuration:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ApplicationModule } from './application/application.module';
import { ServerModule } from './server/server.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
    InfrastructureModule,
    ApplicationModule,
    ServerModule,
  ],
})
export class AppModule {}
```

Environment variables are defined in the Docker Compose file or can be added to a `.env` file in the project root.

## Testing (not yet fully implemented)

The template includes Jest for testing. To run tests:

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

## Deployment

For deployment information, including Docker and Kubernetes setup, see the [Deployment Documentation](./docs/deployment.md).

## Documentation

Additional documentation:
- [Naming Conventions](./docs/naming-conventions.md)

---

## Contributing

Contributions are welcome! Please create a pull request or open an issue to discuss changes.

## License

[MIT License](./LICENSE)
#   C r e p i v a r a  
 