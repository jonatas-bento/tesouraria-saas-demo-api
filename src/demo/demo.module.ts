import { Module } from '@nestjs/common';
import { MembersModule } from '../members/members.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Module({
  imports: [TransactionsModule, MembersModule],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
