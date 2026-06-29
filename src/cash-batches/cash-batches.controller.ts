import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CashBatchesService } from './cash-batches.service';
import { AttachTransactionsDto } from './dto/attach-transactions.dto';
import { CreateCashBatchDto } from './dto/create-cash-batch.dto';
import { UpdateCashBatchDto } from './dto/update-cash-batch.dto';
import { ValidateCashBatchDto } from './dto/validate-cash-batch.dto';

@Controller('cash-batches')
export class CashBatchesController {
  constructor(private readonly cashBatchesService: CashBatchesService) {}

  @Get()
  findAll() {
    return this.cashBatchesService.findAll();
  }

  @Get(':id/available-transactions')
  findAvailableTransactions(@Param('id') id: string) {
    return this.cashBatchesService.findAvailableTransactions(id);
  }

  @Post(':id/attach-transactions')
  attachTransactions(
    @Param('id') id: string,
    @Body() dto: AttachTransactionsDto,
  ) {
    return this.cashBatchesService.attachTransactions(id, dto);
  }

  @Post(':id/validate')
  validate(@Param('id') id: string, @Body() dto: ValidateCashBatchDto) {
    return this.cashBatchesService.validate(id, dto);
  }

  @Post(':id/reopen')
  reopen(@Param('id') id: string) {
    return this.cashBatchesService.reopen(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashBatchesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCashBatchDto) {
    return this.cashBatchesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCashBatchDto) {
    return this.cashBatchesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashBatchesService.remove(id);
  }
}
