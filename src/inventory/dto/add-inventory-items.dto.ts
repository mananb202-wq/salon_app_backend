import { 

    IsDateString,
    IsNotEmpty, 
    IsNumber, 
    IsString 
}from 'class-validator' ;


export class AddInventoryItemsDto{
    
  @IsNotEmpty()
  @IsString()
  name!:string;

  @IsNotEmpty()
  @IsNumber()
  quantity!:number;

  @IsNotEmpty()
  @IsNumber()
  price!:number;

  @IsNotEmpty()
  @IsString()
  brand!:string;

  @IsNotEmpty()
  @IsDateString()
  expiryDate!: string;

  @IsNotEmpty()
  @IsNumber()
  branchId!:number;

}