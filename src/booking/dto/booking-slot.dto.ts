import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsString,
} from 'class-validator';

export class BookingDto{
  @IsNotEmpty()
  @IsNumber()
  branchId!: number;

  @IsNotEmpty()
  @IsNumber()
  serviceId!: number;

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
  bookingDate!: Date;

  @IsNotEmpty()
  @IsString()
  bookingTime!: string;
}
