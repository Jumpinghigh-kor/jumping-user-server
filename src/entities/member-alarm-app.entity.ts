import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('member_alarm_app')
export class MemberAlarmApp {
  @PrimaryGeneratedColumn()
  alarm_app_id: number;

  @Column({ name: 'mem_id' })
  mem_id: number;

  @Column({ name: 'push_yn' })
  push_yn: string;

  @Column({ name: 'push_token' })
  push_token: string;

  @Column({ name: 'reg_dt' })
  reg_dt: string;

  @Column({ name: 'reg_id' })
  reg_id: number;

  @Column({ name: 'mod_dt', nullable: true })
  mod_dt: string;

  @Column({ name: 'mod_id', nullable: true })
  mod_id: number;
} 