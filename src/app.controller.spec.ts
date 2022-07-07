import { BullModule } from '@nestjs/bull';
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import PrintMeAtSchema from './schemas/print-me-at.schema';
import MessageConsumerService from './workers/message.consumer';
import MessageProducerService from './workers/message.producer';

describe('AppController', () => {
  let appController: AppController;

  const printMeAtSchema: PrintMeAtSchema = {
    message: 'test',
    time: '01:00',
  };

  const printMeAtSchemaInvalid = {} as PrintMeAtSchema;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('when validation fails', () => {
    let target: ValidationPipe;
    beforeEach(() => {
      target = new ValidationPipe();
    });
    it('validate Schema', async () => {
      try {
        const printMeAtSchema = new PrintMeAtSchema();
        printMeAtSchema.message = 'test';
        await target.transform(printMeAtSchema, {
          type: 'query',
          metatype: PrintMeAtSchema,
        });
      } catch (err) {
        expect(err.getResponse().message).toEqual([
          'time must be a valid representation of military time in the format HH:MM',
        ]);
      }
    });
  });

  describe('printMeAt', () => {
    it('should return "test"', () => {
      expect(appController.printMeAt(printMeAtSchema)).toBe('test');
    });
  });

  describe('printMeAt', () => {
    it('should catch error "Invalid time"', () => {
      try {
        appController.printMeAt(printMeAtSchemaInvalid);
      } catch (err) {
        expect(err.message).toBe('Invalid time');
      }
    });
  });
});
