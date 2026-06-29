import { Injectable } from '@nestjs/common';
import { MembersService } from '../members/members.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class DemoService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly membersService: MembersService,
  ) {}

  async reset() {
    const [transactions, members] = await Promise.all([
      this.transactionsService.resetDemoData(),
      this.membersService.resetDemoData(),
    ]);

    return {
      message: 'Dados demonstrativos restaurados com sucesso.',
      transactionsCount: transactions.length,
      membersCount: members.length,
      transactions,
      members,
    };
  }
}
