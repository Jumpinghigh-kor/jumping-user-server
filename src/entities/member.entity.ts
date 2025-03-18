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
} 