import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import PrintMeAtSchema from './schemas/print-me-at.schema';
import MessageProducerService from './workers/message.producer';

@Controller()
export class AppController {
  constructor(private messageProducerService: MessageProducerService) {}

  @ApiOperation({ summary: 'Print me at' })
  @ApiQuery({ name: 'message', type: String })
  @ApiQuery({ name: 'time', type: String })
  @ApiOkResponse({ type: String })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        statusCode: 400,
        message: ['some error'],
        error: 'Bad Request',
      },
    },
    description: '400. ValidationException',
  })
  @Get('/printMeAt')
  printMeAt(@Query() printMeAtSchema: PrintMeAtSchema): string {
    try {
      this.messageProducerService.sendMessage(printMeAtSchema);
      return printMeAtSchema.message;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
