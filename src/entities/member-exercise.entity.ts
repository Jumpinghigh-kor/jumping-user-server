import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('member_exercise')
export class MemberExercise {
  @PrimaryGeneratedColumn()
  exercise_id: number;

  @Column({ name: 'mem_id' })
  mem_id: number;

  @Column({ name: 'exercise_dt' })
  exercise_dt: string;

  @Column({ name: 'exercise_time' })
  exercise_time: string;

  @Column({ name: 'intensity_level' })
  intensity_level: string;

  @Column({ name: 'heart_rate', nullable: true })
  heart_rate: string;

  @Column({ name: 'reg_dt' })
  reg_dt: string;

  @Column({ name: 'reg_id' })
  reg_id: number;

  @Column({ name: 'mod_dt' })
  mod_dt: string;

  @Column({ name: 'mod_id', nullable: true })
  mod_id: number;
} 