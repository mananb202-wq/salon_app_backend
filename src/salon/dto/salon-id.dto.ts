import { IsNotEmpty, } from "class-validator";

export class SalonIdDto{

  @IsNotEmpty()  
  salonId!: number;
}