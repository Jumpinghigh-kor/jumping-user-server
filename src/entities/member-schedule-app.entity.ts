import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('member_schedule')
export class MemberSchedule {
  @PrimaryGeneratedColumn()
  schedule_id: number;

  @Column()
  mem_id: number;

  @Column()
  sch_id: number;

  @Column()
  sch_dt: string;

  @Column({ default: 'N' })
  del_yn: string;

  @Column()
  reg_dt: string;

  @Column()
  reg_id: number;

  @Column({ nullable: true })
  mod_dt: string;

  @Column({ nullable: true })
  mod_id: number;
} 