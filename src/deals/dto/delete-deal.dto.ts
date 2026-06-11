import {
  IsNumber,
  IsNotEmpty
} from 'class-validator';


export class DeleteDealDto{


@IsNumber()
@IsNotEmpty()
branchId!:number


}