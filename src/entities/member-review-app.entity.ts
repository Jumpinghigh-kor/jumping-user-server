import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('member_review_app')
export class MemberReviewApp {
  @PrimaryGeneratedColumn()
  review_app_id: number;

  @Column({ type: 'text' })
  content: string;

  @Column()
  star_point: number;

  @Column({ length: 1, default: 'N' })
  del_yn: string;

  @Column()
  reg_dt: Date;

  @Column()
  reg_id: string;

  @Column()
  product_app_id: number;

  @Column()
  mem_id: number;

  @Column({ nullable: true })
  mod_dt: Date;

  @Column({ nullable: true })
  mod_id: string;

  @Column({ nullable: true })
  review_cnt: number;

  @Column({ nullable: true })
  avg_star_point: number;
} 