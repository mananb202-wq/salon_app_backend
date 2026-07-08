import{
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
}from 'typeorm'
import { BranchEntity } from '../../salon/entities/branch.entity';


@Entity('inventory')
export class InventoryEnity{

@PrimaryGeneratedColumn()
id!:number;

@Column()
name!:string;

@Column()
quantity!:number;

@Column()
price!:number;

@Column()
brand!:string;

@Column({ type: 'date' })
expiryDate!: Date;


@ManyToOne(() => BranchEntity,
    {
      onDelete: 'CASCADE',
    },
  )
  
  @JoinColumn({
    name:"branchId"
  })
  branch!: BranchEntity;


}
