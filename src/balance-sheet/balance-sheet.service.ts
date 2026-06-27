import { Injectable } from '@nestjs/common';
import { BalanceSheetItem } from '../common/interfaces/transaction.interface';
import { MOCK_BALANCE_SHEET } from '../common/data/mock-data';

@Injectable()
export class BalanceSheetService {
  findAll(): BalanceSheetItem[] {
    return MOCK_BALANCE_SHEET;
  }
}
