import{
IsNotEmpty,
IsMobilePhone,
IsEmail,
IsString,
IsNumber
} from 'class-validator';


export class CreateCustomerDto{
   

  @IsNotEmpty()
  @IsString()
  name!: string;

  
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email!:string;

   @IsNotEmpty()
   @IsMobilePhone('en-IN')
   @IsString()
   mobileNumber!: string;

   @IsNotEmpty()
   @IsNumber()
   branchId!:number;

}