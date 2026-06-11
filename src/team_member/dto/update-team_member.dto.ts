import {
  IsOptional,
  IsMobilePhone,
  IsEmail,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateTeamMemberDto {

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsNumber()
  teamMemberID?: number;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsMobilePhone('en-IN')
  mobileNumber?: string;

  @IsOptional()
  @IsNumber()
  roleID?: number;
}