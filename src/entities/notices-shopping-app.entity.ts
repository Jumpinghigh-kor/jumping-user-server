import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('notices_shopping_app')
export class NoticesShoppingApp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'del_yn', default: 'N' })
  del_yn: string;
} 