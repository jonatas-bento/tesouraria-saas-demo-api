import { Injectable } from '@nestjs/common';
import { Report } from '../common/interfaces/transaction.interface';
import { MOCK_REPORTS } from '../common/data/mock-data';

@Injectable()
export class ReportsService {
  findAll(): Report[] {
    return MOCK_REPORTS;
  }
}
