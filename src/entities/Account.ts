import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('accounts')
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50 })
  firstname: string

  @Column({ type: 'varchar', length: 50 })
  lastname: string

  @Index()
  @Column({ type: 'bytea' })
  email: Buffer

  @Column({ type: 'bytea' })
  password: Buffer

  @Column({ length: 32 })
  salt: string

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  balance: number

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
