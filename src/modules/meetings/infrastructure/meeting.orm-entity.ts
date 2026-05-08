import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('meetings')
export class MeetingOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'host_id', type: 'uuid' })
  hostId: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'scheduled_at', type: 'timestamptz' })
  scheduledAt: Date;

  @Index()
  @Column({
    type: 'varchar',
    length: 20,
  })
  status: string;

  @Index({ unique: true })
  @Column({ name: 'meeting_code', type: 'varchar', length: 20 })
  meetingCode: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
