import {
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateBranchScheduleDto {

  @IsOptional()
  @IsString()
  openingTimming?: string;


  @IsOptional()
  @IsNumber()
  closeingTimming?: number;


  @IsOptional()
  @IsNumber()
  selectedDayID?: number;
   
  @IsOptional()
  @IsNumber()
  branchId?:number; 

  
}