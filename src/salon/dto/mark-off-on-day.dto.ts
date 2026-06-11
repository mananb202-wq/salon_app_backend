import {
    IsNumber
}from 'class-validator'

export class MarkAsOffOnDay{


  @IsNumber()
  selectedDayID?: number;
   
  
  @IsNumber()
  branchId?:number; 

}