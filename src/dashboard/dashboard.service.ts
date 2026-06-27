import { Injectable } from '@nestjs/common';
import { DashboardSummary } from '../common/interfaces/transaction.interface';
import { MOCK_TRANSACTIONS } from '../common/data/mock-data';

@Injectable()
export class DashboardService {
  getSummary(): DashboardSummary {
    const totalIncome = MOCK_TRANSACTIONS
      .filter((t) => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = MOCK_TRANSACTIONS
      .filter((t) => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingTransactions = MOCK_TRANSACTIONS.filter(
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
