import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('banner_app')
export class BannerApp {
  @PrimaryGeneratedColumn()
  banner_app_id: number;

  @Column()
  banner_type: string;

  @Column()
  locate: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  file_id: number;

  @Column()
  reg_dt: Date;

  @Column()
  reg_id: string;

  @Column({ default: 'N' })
  del_yn: string;

  @Column({ default: 'Y' })
  use_yn: string;
} 