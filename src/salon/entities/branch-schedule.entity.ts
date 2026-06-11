import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import {BranchEntity} from './branch.entity';
import {WorkingDays} from './working-days.entity'

@Entity('Branch_Schedule')
export class BranchSchedule{

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  Opening_Timmings!: string;

  @Column()
  Closing_Timmings!: string;

  @Column()
  isOpen!: boolean;

    @ManyToOne(
    () => BranchEntity,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'branchId',
  })
  branch!: BranchEntity;

  @ManyToOne(
    () => WorkingDays,
  )
  @JoinColumn({
    name: 'dayId',
  })
  workingday!: WorkingDays;


}