import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('member_return_app')
export class MemberReturnApp {
  @PrimaryGeneratedColumn()
  return_app_id: number;
  
  @Column()
  order_app_id: number;

  @Column()
  mem_id: number;

  @Column()
  return_type: string;

  @Column({ type: 'text' })
  return_status: string;

  @Column()
  reason: string;

  @Column({ length: 1, default: 'N' })
  cancel_yn: string;

  @Column()
  reg_dt: string;

  @Column()
  reg_id: number;

  @Column({ nullable: true })
  mod_dt: string;

  @Column({ nullable: true })
  mod_id: number;
} 