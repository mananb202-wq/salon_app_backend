import{
IsNotEmpty,
IsMobilePhone,
IsEmail,
IsOptional,
IsString,
IsNumber
} from 'class-validator';


export class UpdateBranchDto {

    @IsNumber()
    @IsNotEmpty()
    branchId!:number

     @IsString() 
     @IsOptional()
      @IsNotEmpty()
      name!:string;

      @IsString()
      @IsOptional()
      @IsNotEmpty()
      scoNumber!:string;
      
      @IsString()
      @IsOptional()
      @IsNotEmpty()
      location!:string;
      
      @IsString()
      @IsOptional()
      @IsNotEmpty()
      city!:string;
       
      @IsString()
      @IsOptional()
      @IsNotEmpty()
      country!:string;

      @IsOptional()
      @IsMobilePhone('en-IN')
      mobileNumber!: string;

      @IsString()
      @IsOptional()    
      @IsEmail()
      email!:string;

       @IsString()
      @IsOptional()
      @IsNotEmpty()
      closingTimming!:string;
        
      @IsString()
      @IsOptional()
      @IsNotEmpty()
      openingTimming!:string;


      
      }