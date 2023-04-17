import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  CreateDateColumn
} from 'typeorm'
import { Account } from './Account'

@Entity()
export class Transfer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account

  @Column({ type: 'uuid' })
  accountId: string

  @Column({ type: 'varchar', length: 20 })
  type: string

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string

  @CreateDateColumn()
  createdAt: Date
}
