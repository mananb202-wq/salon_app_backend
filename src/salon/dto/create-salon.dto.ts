import{
IsNotEmpty,
IsMobilePhone,
IsEmail
} from 'class-validator';


export class CreateSalonDto {

      @IsNotEmpty()
      name!:string;

      @IsNotEmpty()
      scoNumber!:string;
      
       @IsNotEmpty()
      location!:string;
        
      @IsNotEmpty()
      city!:string;
       

      @IsNotEmpty()
      country!:string;

       @IsMobilePhone('en-IN')
       mobileNumber!: string;

        @IsEmail()
        email!:string;
        
        @IsNotEmpty()
        openingTimming!:string

        @IsNotEmpty()
        closingTimming!:string
     }
