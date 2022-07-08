import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import PrintMeAtSchema from '../schemas/print-me-at.schema';
import { MESSAGE } from './workers.constants';

@Injectable()
export default class MessageProducerService {
  constructor(@InjectQueue(MESSAGE.QUEUE) private queue: Queue) {}

  sendMessage(printMeAtSchema: PrintMeAtSchema) {
    if (!printMeAtSchema.time) {
      throw new Error('Invalid time');
    }

    const [hour, minute] = printMeAtSchema.time.split(':');
    const delayTime = this.getDelay(Number(hour), Number(minute));
    this.queue.add(
      MESSAGE.JOB,
      {
        text: printMeAtSchema.message,
      },
      { delay: delayTime },
    );
  }

  private getDelay(hours: number, minutes: number): number {
    const day = new Date();
    const currentTime = day.getTime();
    const setTime = day.setHours(hours, minutes, 0, 0);
    const delayTime = setTime - currentTime;

    return delayTime;
  }
}
