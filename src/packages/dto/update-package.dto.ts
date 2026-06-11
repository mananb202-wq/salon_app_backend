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

export class UpdatePackageDto{

@IsOptional()
@IsString()
name!:string;

@IsOptional()
@IsNumber()
dealType!:number;

@IsOptional()
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
@Min(1)
maxDiscountAmount?: number;

@IsOptional()
@IsNumber()
discountAmount?:number 


@IsOptional()
@IsBoolean()
isActive!: boolean;

@IsOptional()
@IsDateString()
startDate!: string;

@IsOptional()
@IsDateString()
endDate!: string;



}