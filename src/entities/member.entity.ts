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

  // Push 토큰
  @Column({ name: 'push_token', nullable: true })
  push_token: string;

  // Push 수신 여부
  @Column({ name: 'push_yn', nullable: true, default: 'Y' })
  push_yn: string;
} 