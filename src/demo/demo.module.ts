import { Module } from '@nestjs/common';
import { TransactionsModule } from '../transactions/transactions.module';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Module({
  imports: [TransactionsModule],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
