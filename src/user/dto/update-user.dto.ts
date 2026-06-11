import{
IsNotEmpty,
  IsNumber,
  IsString,
IsOptional,
IsMobilePhone,
IsEmail
} from 'class-validator';


export class UpdateUserDto {
 
    @IsString()
    @IsOptional()
    firstName!:string;


    @IsString()
    @IsOptional()
    lastName!:string;

    @IsMobilePhone()
    @IsNumber()
    @IsOptional()
    mobileNumber!:string;

    @IsEmail()
    @IsString()
    @IsOptional()
    email!:string

}