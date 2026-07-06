import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  IsArray,
} from 'class-validator';

export class BookingDto {
  @IsNotEmpty()
  @IsNumber()
  branchId!: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  serviceIds?: number[];

  @IsOptional()
  @IsNumber()
  packageId?: number;

  @IsOptional()
  @IsNumber()
  dealId?: number;

  @IsNotEmpty()
  @IsNumber()
  teamMemberId!: number;

  @IsNotEmpty()
  @IsNumber()
  customerId!: number;

  @IsNotEmpty()
  @IsNumber()
  dayId!: number;

  @IsNotEmpty()
  @IsDateString()
  bookingDate!: string;

  @IsNotEmpty()
  @IsString()
  bookingTime!: string;
}