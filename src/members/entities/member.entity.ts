import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type MemberStatus = 'active' | 'away' | 'visitor' | 'transferred';

@Entity('members')
export class MemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 140 })
  name!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 140, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status!: MemberStatus;

  @Column({ name: 'joined_at', type: 'datetime', nullable: true })
  joinedAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
