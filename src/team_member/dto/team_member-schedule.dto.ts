import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TeamMemberScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  teamMemberId!: number;

  @IsNotEmpty()
  @IsNumber()
  dayId!: number;

  @IsOptional()
  @IsString()
  openingTime!: string;

  @IsOptional()
  @IsString()
  closingTime!: string;

  @IsOptional()
  @IsBoolean()
  isWorking!: boolean;
}