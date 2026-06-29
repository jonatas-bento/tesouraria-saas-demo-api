import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class DemoService {
  constructor(private readonly transactionsService: TransactionsService) {}

  async reset() {
    const transactions = await this.transactionsService.resetDemoData();

    return {
      message: 'Dados demonstrativos restaurados com sucesso.',
      transactionsCount: transactions.length,
      transactions,
    };
  }
}
