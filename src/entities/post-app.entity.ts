import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('post_app')
export class PostApp {
  @PrimaryGeneratedColumn()
  post_app_id: number;

  @Column({ name: 'post_type' })
  post_type: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'all_send_yn', nullable: true })
  all_send_yn: string;

  @Column({ name: 'push_send_yn', nullable: true })
  push_send_yn: string;

  @Column({ name: 'del_yn', nullable: true })
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