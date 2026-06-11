import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';


@Entity('Users')
export class User {

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

  @Column(
    {
        unique:true,
    }
  )
  email!:string;
  
}
