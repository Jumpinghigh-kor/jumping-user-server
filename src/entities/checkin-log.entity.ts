import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Member } from './member.entity';

@Entity('checkin_log')
export class CheckinLog {
  @PrimaryGeneratedColumn()
  ci_id: number;

  @Column()
  center_id: number;

  @Column()
  ci_mem_id: number;

  @Column({ type: 'datetime' })
  ci_date: Date;

  @Column({ default: 'N' })
  del_yn: string;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'ci_mem_id', referencedColumnName: 'mem_id' })
  member: Member;
} 