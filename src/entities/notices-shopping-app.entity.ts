import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('notices_shopping_app')
export class NoticesShoppingApp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'notices_type' })
  notices_type: string;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'start_dt' })
  start_dt: string;

  @Column({ name: 'end_dt' })
  end_dt: string;

  @Column({ name: 'del_yn', default: 'N' })
  del_yn: string;
} 