import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('notice')
export class Notice {
  @PrimaryGeneratedColumn()
  return_exchange_id: number;

  @Column({ name: 'product_app_id' })
  product_app_id: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'direction' })
  direction: string;

  @Column({ name: 'order_by' })
  order_by: number;

  @Column({ name: 'use_yn', default: 'Y' })
  use_yn: string;

  @Column({ name: 'del_yn', default: 'N' })
  del_yn: string;

  @Column({ name: 'reg_dt' })
  reg_dt: string;

  @Column({ name: 'reg_id' })
  reg_id: number;

  @Column({ name: 'mod_dt', nullable: true })
  mod_dt: string;

  @Column({ name: 'mod_id', nullable: true })
  mod_id: number;
} 