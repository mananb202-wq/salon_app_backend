import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique
} from 'typeorm';

import { TeamMember } from '../../team_member/entities/team_member.entity';
import { WorkingDays } from '../../salon/entities/working-days.entity';

@Unique(['teamMember', 'workingDay'])
@Entity('TeamMemberSchedules')
export class TeamMemberScheduleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => TeamMember)
  @JoinColumn({ name: 'teamMemberId' })
  teamMember!: TeamMember;

  @ManyToOne(() => WorkingDays)
  @JoinColumn({ name: 'dayId' })
  workingDay!: WorkingDays;

  @Column()
  openingTime!: string;

  @Column()
  closingTime!: string;

  @Column({ default: true })
  isWorking!: boolean;
}