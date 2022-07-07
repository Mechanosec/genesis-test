import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import PrintMeAtSchema from './schemas/print-me-at.schema';
import MessageProducerService from './workers/message.producer';

@Controller()
export class AppController {
  constructor(private messageProducerService: MessageProducerService) {}

  @ApiOperation({ summary: 'Print me at' })
  @ApiOkResponse({ type: () => PrintMeAtSchema })
  @Get('/printMeAt')
  printMeAt(@Query() printMeAtSchema: PrintMeAtSchema): string {
    this.messageProducerService.sendMessage(printMeAtSchema);
    return printMeAtSchema.message;
  }
}
