import { Module } from '@nestjs/common';
import { TransactionsModule } from '../transactions/transactions.module';
import { BalanceSheetController } from './balance-sheet.controller';
import { BalanceSheetService } from './balance-sheet.service';

@Module({
  imports: [TransactionsModule],
  controllers: [BalanceSheetController],
  providers: [BalanceSheetService],
})
export class BalanceSheetModule {}
