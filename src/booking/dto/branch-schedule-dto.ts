import{
IsNumber,
IsNotEmpty
}from "class-validator"

export class BranchScheduleDto{

@IsNotEmpty()
@IsNumber()
branchId!:number;

@IsNotEmpty()
@IsNumber()
dayId!:number;


}