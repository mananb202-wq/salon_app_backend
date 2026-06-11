import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class TeamMemberScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  teamMemberId!: number;

  @IsNotEmpty()
  @IsNumber()
  dayId!: number;

  @IsString()
  openingTime!: string;

  @IsString()
  closingTime!: string;

  @IsBoolean()
  isWorking!: boolean;
}