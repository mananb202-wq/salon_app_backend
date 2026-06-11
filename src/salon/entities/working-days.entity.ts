import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';


@Entity('Working_Days')
export class WorkingDays{

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string

}