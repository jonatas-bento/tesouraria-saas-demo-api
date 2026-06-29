import { Injectable } from '@nestjs/common';
import { BalanceSheetItem } from '../common/interfaces/transaction.interface';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class BalanceSheetService {
  constructor(private readonly transactionsService: TransactionsService) {}

  async findAll(): Promise<BalanceSheetItem[]> {
    const transactions = await this.transactionsService.findAll();

    const completedIncome = this.sumBy('income', 'completed', transactions);
    const completedExpenses = this.sumBy('expense', 'completed', transactions);
    const pendingIncome = this.sumBy('income', 'pending', transactions);
    const pendingExpenses = this.sumBy('expense', 'pending', transactions);

    return [
      {
        account: 'Caixa/Bancos',
        debit: completedIncome,
        credit: completedExpenses,
        balance: completedIncome - completedExpenses,
      },
      {
        account: 'Contas a Receber',
        debit: pendingIncome,
        credit: 0,
        balance: pendingIncome,
      },
      {
        account: 'Contas a Pagar',
        debit: 0,
        credit: pendingExpenses,
        balance: -pendingExpenses,
      },
      {
        account: 'Receitas Realizadas',
        debit: 0,
        credit: completedIncome,
        balance: -completedIncome,
      },
      {
        account: 'Despesas Realizadas',
        debit: completedExpenses,
        credit: 0,
        balance: completedExpenses,
      },
    ];
  }

  private sumBy(
    type: 'income' | 'expense',
    status: 'pending' | 'completed' | 'cancelled',
    transactions: Array<{
      type: 'income' | 'expense';
      status: 'pending' | 'completed' | 'cancelled';
      amount: number;
    }>,
  ): number {
    return transactions
      .filter((t) => t.type === type && t.status === status)
      .reduce((sum, t) => sum + t.amount, 0);
  }
}
