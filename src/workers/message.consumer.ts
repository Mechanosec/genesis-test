import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MESSAGE } from './workers.constants';

@Processor(MESSAGE.QUEUE)
export default class MessageConsumerService {
  @Process(MESSAGE.JOB)
  messageJob(job: Job<unknown>) {
    console.log(job.data);
  }
}
