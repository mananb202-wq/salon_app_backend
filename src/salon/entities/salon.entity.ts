import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity('salons')
export class Salon {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  
  @Column(
    {
        unique:true,
    }
  )
  mobile_number!:string;
  

  @ManyToOne(
    () => User,
  )
  @JoinColumn({
    name: 'userId',
  })
  user!: User;
}