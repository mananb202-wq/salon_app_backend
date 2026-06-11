import {
  IsString,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateDealDto {

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  branchId!: number;

  @IsNotEmpty()
  @IsNumber()
  serviceId!: number;

  @IsNotEmpty()
  @IsNumber()
  dealTypeId!: number;

  @IsNotEmpty()
  @IsNumber()
  originalPrice!: number;


  @IsOptional()
  @IsNumber()
  value?: number;


  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  percentage?: number;


  @IsOptional()
  @IsNumber()
  maxDiscountAmount?: number;

  @IsNotEmpty()
  @IsBoolean()
  isActive!: boolean;

  @IsNotEmpty()
  @IsDateString()
  startDate!: string;

  @IsNotEmpty()
  @IsDateString()
  endDate!: string;
}