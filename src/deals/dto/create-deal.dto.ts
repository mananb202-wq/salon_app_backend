import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
  dealTypeId!: number;

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
  @Min(1)
  maxDiscountAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  discountAmount?: number;

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