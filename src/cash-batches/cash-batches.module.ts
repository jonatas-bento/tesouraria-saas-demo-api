import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../transactions/entities/transaction.entity';
import { CashBatchesController } from './cash-batches.controller';
import { CashBatchesService } from './cash-batches.service';
import { CashBatchEntity } from './entities/cash-batch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CashBatchEntity, TransactionEntity])],
  controllers: [CashBatchesController],
  providers: [CashBatchesService],
  exports: [CashBatchesService],
})
export class CashBatchesModule {}
