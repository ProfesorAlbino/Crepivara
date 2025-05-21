import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const grpcApp = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'your_package',
      protoPath: 'path/to/your.proto',
      url: '0.0.0.0:5000',
    },
  });
  
  await app.listen(3000);
  // await grpcApp.listen();
  
  console.log(`Application running on ${await app.getUrl()}`);
}
bootstrap();