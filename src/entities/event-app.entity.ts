import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('event_app')
export class EventApp {
  @PrimaryGeneratedColumn()
  event_app_id: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'use_yn' })
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