import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalanceSheetModule } from './balance-sheet/balance-sheet.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DemoModule } from './demo/demo.module';
import { HealthModule } from './health/health.module';
import { MembersModule } from './members/members.module';
import { ReportsModule } from './reports/reports.module';
import { TransactionsModule } from './transactions/transactions.module';

const dataDirectory = join(process.cwd(), 'data');

if (!existsSync(dataDirectory)) {
  mkdirSync(dataDirectory, { recursive: true });
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(dataDirectory, 'demo.sqlite'),
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
    }),
    HealthModule,
    DashboardModule,
    TransactionsModule,
    BalanceSheetModule,
    ReportsModule,
    MembersModule,
    DemoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
