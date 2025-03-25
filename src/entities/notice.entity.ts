import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('notice')
export class Notice {
  @PrimaryGeneratedColumn()
  notice_id: number;

  @Column({ name: 'notice_title' })
  notice_title: string;

  @Column({ name: 'notice_content', type: 'text' })
  notice_content: string;

  @Column({ name: 'notice_type' })
  notice_type: string;

  @Column({ name: 'reg_dt' })
  reg_dt: string;

  @Column({ name: 'reg_id' })
  reg_id: number;

  @Column({ name: 'mod_dt', nullable: true })
  mod_dt: string;

  @Column({ name: 'mod_id', nullable: true })
  mod_id: number;

  @Column({ name: 'use_yn', default: 'Y' })
  use_yn: string;
} 