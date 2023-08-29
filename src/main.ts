import {NestApplication, NestFactory} from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import {ExpressAdapter} from "@nestjs/platform-express";
import {Server} from "https";
import * as fs from "fs";
import express, {Express} from 'express';
import spdy from 'spdy';
import {ServerOptions} from "spdy";

async function bootstrap() {
  // const appOptions = { cors: true };
  // const app = await NestFactory.create(AppModule, appOptions);
  // app.setGlobalPrefix('api');
  //
  // const options = new DocumentBuilder()
  //   .setTitle('SIA Data Wallet API')
  //   .setDescription('SIA Data Wallet API description')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build();
  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('/docs', app, document);
  //
  // await app.listen(3000);


  const expressApp: Express = express();

  const spdyOpts: ServerOptions = {
    key: fs.readFileSync('./test.key'),
    cert: fs.readFileSync('./test.crt'),
  };

  const server: Server = spdy.createServer(spdyOpts, expressApp);

  const appOptions = { cors: true };

  const app: NestApplication = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      appOptions
  );
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('SIA Data Wallet API')
    .setDescription('SIA Data Wallet API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  await app.init();
  await server.listen(443);
}
bootstrap()
  .catch((err) => {
    console.log(err);
  });
