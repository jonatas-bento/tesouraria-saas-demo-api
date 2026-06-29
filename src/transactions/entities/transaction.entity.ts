import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'datetime' })
  date!: Date;

  @Column({ type: 'varchar', length: 160 })
  description!: string;

  @Column({ type: 'real' })
  amount!: number;

  @Column({ type: 'varchar', length: 80 })
  category!: string;

  @Column({ type: 'varchar', length: 20 })
  type!: TransactionType;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: TransactionStatus;

  @Column({ name: 'batch_id', type: 'varchar', length: 36, nullable: true })
  batchId!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
