import{
IsNotEmpty,
IsMobilePhone,
IsEmail,
IsOptional,
IsNumber
} from 'class-validator';


export class UpdateSalonDto {


     @IsNumber()
     salonId!:number;

      @IsOptional()
      @IsNotEmpty()
      name!:string;

       @IsOptional()      
       @IsMobilePhone('en-IN')
       mobileNumber!: string;
        

    
     }