import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import MessageConsumerService from './workers/message.consumer';
import MessageProducerService from './workers/message.producer';
import { MESSAGE } from './workers/workers.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: MESSAGE.QUEUE,
    }),
  ],
  controllers: [AppController],
  providers: [MessageProducerService, MessageConsumerService],
})
export class AppModule {}
