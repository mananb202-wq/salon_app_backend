import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity('ConsumerCategory')
export class ConsumerCategory{
  @PrimaryGeneratedColumn()
  id!: number;

   @Column({ 
    unique: true,
  })
  name!: string; 
}