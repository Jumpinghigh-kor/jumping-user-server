import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_app')
export class ProductApp {
  @PrimaryGeneratedColumn()
  product_app_id: number;

  @Column({ nullable: true })
  product_app_type: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  original_price: number;

  @Column({ nullable: true })
  discount: number;

  @Column({ nullable: true })
  sell_start_dt: string;

  @Column({ nullable: true })
  sell_end_dt: string;

  @Column({ nullable: true, default: 'Y' })
  view_yn: string;

  @Column({ nullable: true, default: 'N' })
  del_yn: string;

  @Column({ nullable: true })
  reg_dt: string;

  @Column({ nullable: true })
  reg_id: string;

  @Column({ nullable: true })
  mod_dt: string;

  @Column({ nullable: true })
  mod_id: string;
} 