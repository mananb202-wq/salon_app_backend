import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';

import { Type } from 'class-transformer';

export class UpdateDealDto {


  @IsNumber()
  branchId?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  dealTypeId?: number;

  @IsOptional()
  @IsNumber()
  value?: number;


  @IsOptional()
  @IsNumber()
  originalPrice!: number;

  @IsOptional()
  @IsNumber()
  percentage!: number;


  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  maxDiscountAmount?: number;
}