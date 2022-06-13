import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { ExpressAdapter } from '@nestjs/platform-express';
import { config } from 'dotenv';
import bodyParser from 'body-parser';

config();

const binaryMimeTypes: string[] = ['application/vnd.apple.pkpass'];

let cachedServer: Server;

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);
  if (!cachedServer) {
    const expressApp = require('express')();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    // nestApp.use(bodyParser.json());
    // nestApp.use(bodyParser.urlencoded({extended: true}));
    nestApp.use(eventContext());
    nestApp.enableCors({
      'origin': '*',
      'methods': 'GET, HEAD, PUT, PATCH, POST, DELETE',
      'preflightContinue': true,
      'optionsSuccessStatus': 204,
      'credentials': true
    });
    await nestApp.init();
    await nestApp.listen(3000);
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}
bootstrap();
export const handler: Handler = async (event: any, context: Context) => {
  cachedServer = await bootstrap();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
}
