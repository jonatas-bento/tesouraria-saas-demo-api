import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { FindManyOptions, Repository } from 'typeorm';
import { MOCK_TRANSACTIONS } from '../common/data/mock-data';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  TransactionEntity,
  TransactionType,
} from './entities/transaction.entity';

@Injectable()
export class TransactionsService implements OnModuleInit {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionsRepository: Repository<TransactionEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedIfEmpty();
  }

  async findAll(type?: string): Promise<TransactionEntity[]> {
    const normalizedType = this.normalizeType(type);

    const options: FindManyOptions<TransactionEntity> = {
      order: {
        date: 'DESC',
        createdAt: 'DESC',
      },
    };

    if (normalizedType) {
      options.where = {
        type: normalizedType,
      };
    }

    return this.transactionsRepository.find(options);
  }

  async findOne(id: string): Promise<TransactionEntity> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada.');
    }

    return transaction;
  }

  async create(dto: CreateTransactionDto): Promise<TransactionEntity> {
    const transaction = this.transactionsRepository.create({
      id: randomUUID(),
      date: new Date(dto.date),
      description: dto.description,
      amount: dto.amount,
      category: dto.category,
      type: dto.type,
      status: dto.status,
    });

    return this.transactionsRepository.save(transaction);
  }

  async update(
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    const transaction = await this.findOne(id);

    if (dto.date !== undefined) {
      transaction.date = new Date(dto.date);
    }

    if (dto.description !== undefined) {
      transaction.description = dto.description;
    }

    if (dto.amount !== undefined) {
      transaction.amount = dto.amount;
    }

    if (dto.category !== undefined) {
      transaction.category = dto.category;
    }

    if (dto.type !== undefined) {
      transaction.type = dto.type;
    }

    if (dto.status !== undefined) {
      transaction.status = dto.status;
    }

    return this.transactionsRepository.save(transaction);
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const transaction = await this.findOne(id);

    await this.transactionsRepository.remove(transaction);

    return {
      id,
      deleted: true,
    };
  }

  async resetDemoData(): Promise<TransactionEntity[]> {
    await this.transactionsRepository.clear();

    const seedTransactions = MOCK_TRANSACTIONS.map((transaction) =>
      this.transactionsRepository.create({
        id: transaction.id,
        date: new Date(transaction.date),
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
        status: transaction.status,
        batchId: null,
      }),
    );

    await this.transactionsRepository.save(seedTransactions);

    return this.findAll();
  }

  private async seedIfEmpty(): Promise<void> {
    const count = await this.transactionsRepository.count();

    if (count === 0) {
      await this.resetDemoData();
    }
  }

  private normalizeType(type?: string): TransactionType | undefined {
    if (!type) {
      return undefined;
    }

    if (type !== 'income' && type !== 'expense') {
      throw new BadRequestException(
        'Tipo de transação inválido. Use income ou expense.',
      );
    }

    return type;
  }
}
