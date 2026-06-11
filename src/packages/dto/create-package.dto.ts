import {
    IsArray,
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
    Min,
  Max,
} from 'class-validator';

export class CreatePackage{
 
@IsNotEmpty()
@IsString()
name!:string;


@IsNotEmpty()
@IsNumber()
branchId!:number;


@IsNotEmpty()
@IsNumber()
dealType!:number;


@IsNotEmpty()
@IsArray()
@IsNumber({}, { each: true })
serviceIds!: number[];

@IsOptional()
@IsNumber()
@Min(0.01)
@Max(99.99)
percentageDiscount?: number;

@IsOptional()
@IsNumber()
discountAmount?:number 

@IsOptional()
@IsNumber()
@Min(1)
maxDiscountAmount?: number;

@IsBoolean()
isActive!: boolean;

@IsNotEmpty()
@IsDateString()
startDate!: string;

@IsNotEmpty()
@IsDateString()
endDate!: string;

}