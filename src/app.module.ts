import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import MessageConsumerService from './workers/message.consumer';
import MessageProducerService from './workers/message.producer';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'message-queue',
    }),
  ],
  controllers: [AppController],
  providers: [MessageProducerService, MessageConsumerService],
})
export class AppModule {}
