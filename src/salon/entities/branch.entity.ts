import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import {Salon} from './salon.entity' 


@Entity('branches')
export class BranchEntity {

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

  @Column()
  sco_number!: string;

  @Column()
  location!: string;

   @Column()
  city!: string;

   @Column()
  country!: string;

  @Column()
  email!: string;

  @Column()
  Opening_Timming!:string;

  @Column()
  Closing_Timming!:string;

  @ManyToOne(() => Salon,
       {
      onDelete: 'CASCADE',
        },

   )
  @JoinColumn({ name: 'salon_id' })
  salon!: Salon;

}