import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  mem_id: number;

  // 이메일 아이디
  @Column({ name: 'mem_email_id' })
  mem_email_id: string;

  // 앱 비밀번호
  @Column({ name: 'mem_app_password' })
  mem_app_password: string;

  // 이름
  @Column({ name: 'mem_name' })
  mem_name: string;

  // 센터 아이디
  @Column({ name: 'center_id' })
  center_id: string;

  @Column({ nullable: true })
  app_exit_dt: string;

  @Column({ nullable: true })
  recent_dt: string;

  // 앱 수정 날짜
  @Column({ name: 'app_mod_dt', nullable: true })
  app_mod_dt: string;
  
  // 앱 수정 ID
  @Column({ name: 'app_mod_id', nullable: true })
  app_mod_id: number;

  @Column({ nullable: true })
  mem_app_status: string;

  @Column({ nullable: true })
  mem_nickname: string;

  @Column({ nullable: true })
  push_yn: string;

  @Column({ nullable: true })
  push_token: string;
} 