import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BalanceSheetModule } from './balance-sheet/balance-sheet.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [HealthModule, DashboardModule, TransactionsModule, BalanceSheetModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
