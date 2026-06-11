import {
     Entity, 
       PrimaryGeneratedColumn,
       Column
}from "typeorm";


@Entity('otp')
export class OtpEntity{

      @PrimaryGeneratedColumn()
      id!: number;
      
      @Column()
      Otp!: string;

}


