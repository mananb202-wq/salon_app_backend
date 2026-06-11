import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn
} from 'typeorm';

import {BranchEntity} from '../../salon/entities/branch.entity';
@Entity("customers")
export class CustomerEntity{

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column(
     {
        unique:true,
    }
  )
  mobileNumber!:string;

  @Column(
      {
        unique:true,
    }
  )
  email!:string;

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
  



}