import { Injectable } from '@nestjs/common';
import { Transaction } from '../common/interfaces/transaction.interface';
import { MOCK_TRANSACTIONS } from '../common/data/mock-data';

@Injectable()
export class TransactionsService {
  findAll(type?: 'income' | 'expense'): Transaction[] {
    if (type) {
      return MOCK_TRANSACTIONS.filter((t) => t.type === type);
    }
    return MOCK_TRANSACTIONS;
  }
}
