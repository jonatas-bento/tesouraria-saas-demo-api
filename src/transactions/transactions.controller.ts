import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@Query('type') type?: 'income' | 'expense') {
    return this.transactionsService.findAll(type);
  }
}
