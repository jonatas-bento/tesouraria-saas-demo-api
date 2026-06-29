import { Injectable } from '@nestjs/common';
import { CashBatchesService } from '../cash-batches/cash-batches.service';
import { MembersService } from '../members/members.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class DemoService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly membersService: MembersService,
    private readonly cashBatchesService: CashBatchesService,
  ) {}

  async reset() {
    const transactions = await this.transactionsService.resetDemoData();
    const members = await this.membersService.resetDemoData();
    const cashBatches = await this.cashBatchesService.resetDemoData();

    return {
      message: 'Dados demonstrativos restaurados com sucesso.',
      transactionsCount: transactions.length,
      membersCount: members.length,
      cashBatchesCount: cashBatches.length,
      transactions,
      members,
      cashBatches,
    };
  }
}
