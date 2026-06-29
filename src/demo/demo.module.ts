import { Module } from '@nestjs/common';
import { CashBatchesModule } from '../cash-batches/cash-batches.module';
import { MembersModule } from '../members/members.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Module({
  imports: [TransactionsModule, MembersModule, CashBatchesModule],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
