import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import {RoleEntity} from '../../roles/entities/role.entity'
import {BranchEntity} from '../../salon/entities/branch.entity'

@Entity('TeamMembers')
export class TeamMember {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  first_name!: string;


  @Column()
  last_name!: string;

  @Column(
    {
        unique:true,
    }
  )
  mobile_number!:string;

  @Column()
  email!:string;

@ManyToOne(
 () => RoleEntity,
  )
  @JoinColumn({
    name: 'roleId',
  })
  role!: RoleEntity;


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
