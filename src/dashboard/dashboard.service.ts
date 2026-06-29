import { Injectable } from '@nestjs/common';
import { DashboardSummary } from '../common/interfaces/transaction.interface';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class DashboardService {
  constructor(private readonly transactionsService: TransactionsService) {}

  async getSummary(): Promise<DashboardSummary> {
    const transactions = await this.transactionsService.findAll();

    const totalIncome = transactions
      .filter((t) => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingTransactions = transactions.filter(
      (t) => t.status === 'pending',
    ).length;

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      pendingTransactions,
    };
  }
}
