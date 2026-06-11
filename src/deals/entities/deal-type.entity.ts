import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('deal_type')
export class DealTypeEntity{
      
    @PrimaryGeneratedColumn()
    id!: number;


  @Column({ unique: true })
   name!: string;
}