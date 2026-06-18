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
  IsEnum
} from 'class-validator';
import { DurationType } from '../entities/package.entity';

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
@IsNumber()
duration!:number;

@IsEnum(DurationType)
durationType!: DurationType;

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

}