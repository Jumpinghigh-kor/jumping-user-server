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

  @Column({ nullable: true })
  courier_code: string;

  @Column({ nullable: true })
  delivery_fee: number;

  @Column({ nullable: true })
  remote_delivery_fee: number;

  @Column({ nullable: true })
  free_shipping_amount: number;

  @Column({ nullable: true })
  inquiry_phone_number: string;

  @Column({ nullable: true })
  today_send_yn: string;

  @Column({ nullable: true })
  today_send_time: string;

  @Column({ nullable: true })
  not_today_send_day: string;

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