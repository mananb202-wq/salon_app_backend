import{
IsNotEmpty,
IsMobilePhone,
IsEmail
} from 'class-validator';


export class CreateUserDto {

  @IsNotEmpty()
  firstName!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  email!:string;

   @IsMobilePhone('en-IN')
    mobileNumber!: string;
            
    
}
