import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { TransactionEntity } from '../transactions/entities/transaction.entity';
import { AttachTransactionsDto } from './dto/attach-transactions.dto';
import { CreateCashBatchDto } from './dto/create-cash-batch.dto';
import { UpdateCashBatchDto } from './dto/update-cash-batch.dto';
import { ValidateCashBatchDto } from './dto/validate-cash-batch.dto';
import { CashBatchEntity, CashBatchStatus } from './entities/cash-batch.entity';

export interface CashBatchWithTotals extends CashBatchEntity {
  launchedAmount: number;
  difference: number;
  transactionsCount: number;
  transactions?: TransactionEntity[];
}

@Injectable()
export class CashBatchesService implements OnModuleInit {
  constructor(
    @InjectRepository(CashBatchEntity)
    private readonly cashBatchesRepository: Repository<CashBatchEntity>,

    @InjectRepository(TransactionEntity)
    private readonly transactionsRepository: Repository<TransactionEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedIfEmpty();
  }

  async findAll(): Promise<CashBatchWithTotals[]> {
    const batches = await this.cashBatchesRepository.find({
      order: {
        date: 'DESC',
        createdAt: 'DESC',
      },
    });

    return Promise.all(batches.map((batch) => this.withTotals(batch)));
  }

  async findOne(id: string): Promise<CashBatchWithTotals> {
    const batch = await this.cashBatchesRepository.findOne({
      where: { id },
    });

    if (!batch) {
      throw new NotFoundException('Lote de conferência não encontrado.');
    }

    return this.withTotals(batch, true);
  }

  async create(dto: CreateCashBatchDto): Promise<CashBatchWithTotals> {
    const batch = this.cashBatchesRepository.create({
      date: new Date(dto.date),
      description: dto.description.trim(),
      countedAmount: dto.countedAmount,
      countedBy: dto.countedBy.trim(),
      status: 'open',
      validatedBy: null,
      validatedAt: null,
      notes: this.normalizeOptionalText(dto.notes),
    });

    const saved = await this.cashBatchesRepository.save(batch);

    return this.withTotals(saved, true);
  }

  async update(
    id: string,
    dto: UpdateCashBatchDto,
  ): Promise<CashBatchWithTotals> {
    const batch = await this.findBatchEntity(id);

    if (dto.date !== undefined) {
      batch.date = new Date(dto.date);
    }

    if (dto.description !== undefined) {
      batch.description = dto.description.trim();
    }

    if (dto.countedAmount !== undefined) {
      batch.countedAmount = dto.countedAmount;
    }

    if (dto.countedBy !== undefined) {
      batch.countedBy = dto.countedBy.trim();
    }

    if (dto.status !== undefined) {
      batch.status = dto.status;
    }

    if (dto.validatedBy !== undefined) {
      batch.validatedBy = this.normalizeOptionalText(dto.validatedBy);
    }

    if (dto.notes !== undefined) {
      batch.notes = this.normalizeOptionalText(dto.notes);
    }

    const saved = await this.cashBatchesRepository.save(batch);

    return this.withTotals(saved, true);
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const batch = await this.findBatchEntity(id);

    await this.transactionsRepository.update(
      {
        batchId: id,
      },
      {
        batchId: null,
      },
    );

    await this.cashBatchesRepository.remove(batch);

    return {
      id,
      deleted: true,
    };
  }

  async findAvailableTransactions(
    batchId: string,
  ): Promise<TransactionEntity[]> {
    await this.findBatchEntity(batchId);

    return this.transactionsRepository.find({
      where: [
        {
          type: 'income',
          batchId: IsNull(),
        },
        {
          type: 'income',
          batchId,
        },
      ],
      order: {
        date: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  async attachTransactions(
    id: string,
    dto: AttachTransactionsDto,
  ): Promise<CashBatchWithTotals> {
    const batch = await this.findBatchEntity(id);

    if (batch.status === 'validated') {
      throw new BadRequestException(
        'Não é possível alterar um lote já validado. Reabra o lote primeiro.',
      );
    }

    const transactions = await this.transactionsRepository.find({
      where: {
        id: In(dto.transactionIds),
      },
    });

    if (transactions.length !== dto.transactionIds.length) {
      throw new BadRequestException(
        'Uma ou mais entradas não foram encontradas.',
      );
    }

    const invalidTransactions = transactions.filter(
      (transaction) => transaction.type !== 'income',
    );

    if (invalidTransactions.length > 0) {
      throw new BadRequestException(
        'Somente transações de entrada podem ser vinculadas a um lote.',
      );
    }

    const unavailableTransactions = transactions.filter(
      (transaction) => transaction.batchId && transaction.batchId !== id,
    );

    if (unavailableTransactions.length > 0) {
      throw new BadRequestException(
        'Uma ou mais entradas já estão vinculadas a outro lote.',
      );
    }

    await this.transactionsRepository.update(
      {
        batchId: id,
      },
      {
        batchId: null,
      },
    );

    await this.transactionsRepository.update(
      {
        id: In(dto.transactionIds),
      },
      {
        batchId: id,
      },
    );

    batch.status = 'checking';
    batch.validatedBy = null;
    batch.validatedAt = null;

    const saved = await this.cashBatchesRepository.save(batch);

    return this.withTotals(saved, true);
  }

  async validate(
    id: string,
    dto: ValidateCashBatchDto,
  ): Promise<CashBatchWithTotals> {
    const batch = await this.findBatchEntity(id);
    const totals = await this.calculateTotals(batch.id);

    batch.validatedBy = dto.validatedBy.trim();
    batch.validatedAt = new Date();
    batch.notes = this.normalizeOptionalText(dto.notes) ?? batch.notes;
    batch.status = this.getValidationStatus(
      batch.countedAmount,
      totals.launchedAmount,
    );

    const saved = await this.cashBatchesRepository.save(batch);

    return this.withTotals(saved, true);
  }

  async reopen(id: string): Promise<CashBatchWithTotals> {
    const batch = await this.findBatchEntity(id);

    batch.status = 'checking';
    batch.validatedBy = null;
    batch.validatedAt = null;

    const saved = await this.cashBatchesRepository.save(batch);

    return this.withTotals(saved, true);
  }

  async resetDemoData(): Promise<CashBatchWithTotals[]> {
    await this.cashBatchesRepository.clear();

    await this.transactionsRepository
      .createQueryBuilder()
      .update(TransactionEntity)
      .set({ batchId: null })
      .execute();

    const batch = this.cashBatchesRepository.create({
      date: new Date('2026-06-05'),
      description: 'Lote de conferência - entradas iniciais da demo',
      countedAmount: 23500,
      countedBy: 'Tesoureiro Demo',
      status: 'validated',
      validatedBy: 'Tesoureiro Demo',
      validatedAt: new Date('2026-06-05T21:00:00'),
      notes: 'Lote demonstrativo validado sem divergência.',
    });

    const saved = await this.cashBatchesRepository.save(batch);

    await this.transactionsRepository.update(
      {
        id: In(['1', '2']),
      },
      {
        batchId: saved.id,
      },
    );

    return this.findAll();
  }

  private async seedIfEmpty(): Promise<void> {
    const count = await this.cashBatchesRepository.count();

    if (count === 0) {
      await this.resetDemoData();
    }
  }

  private async findBatchEntity(id: string): Promise<CashBatchEntity> {
    const batch = await this.cashBatchesRepository.findOne({
      where: { id },
    });

    if (!batch) {
      throw new NotFoundException('Lote de conferência não encontrado.');
    }

    return batch;
  }

  private async withTotals(
    batch: CashBatchEntity,
    includeTransactions = false,
  ): Promise<CashBatchWithTotals> {
    const totals = await this.calculateTotals(batch.id);

    return {
      ...batch,
      launchedAmount: totals.launchedAmount,
      difference: Number(
        (batch.countedAmount - totals.launchedAmount).toFixed(2),
      ),
      transactionsCount: totals.transactions.length,
      transactions: includeTransactions ? totals.transactions : undefined,
    };
  }

  private async calculateTotals(batchId: string): Promise<{
    launchedAmount: number;
    transactions: TransactionEntity[];
  }> {
    const transactions = await this.transactionsRepository.find({
      where: {
        batchId,
        type: 'income',
      },
      order: {
        date: 'DESC',
        createdAt: 'DESC',
      },
    });

    const launchedAmount = transactions
      .filter((transaction) => transaction.status !== 'cancelled')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      launchedAmount,
      transactions,
    };
  }

  private getValidationStatus(
    countedAmount: number,
    launchedAmount: number,
  ): CashBatchStatus {
    const difference = Number((countedAmount - launchedAmount).toFixed(2));

    return Math.abs(difference) < 0.01 ? 'validated' : 'divergent';
  }

  private normalizeOptionalText(value?: string): string | null {
    const normalized = value?.trim();

    return normalized ? normalized : null;
  }
}
