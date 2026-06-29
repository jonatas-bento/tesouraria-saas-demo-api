import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type CashBatchStatus = 'open' | 'checking' | 'validated' | 'divergent';

@Entity('cash_batches')
export class CashBatchEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'datetime' })
  date!: Date;

  @Column({ type: 'varchar', length: 160 })
  description!: string;

  @Column({ name: 'counted_amount', type: 'real' })
  countedAmount!: number;

  @Column({ name: 'counted_by', type: 'varchar', length: 120 })
  countedBy!: string;

  @Column({ type: 'varchar', length: 20, default: 'open' })
  status!: CashBatchStatus;

  @Column({
    name: 'validated_by',
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  validatedBy!: string | null;

  @Column({ name: 'validated_at', type: 'datetime', nullable: true })
  validatedAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
