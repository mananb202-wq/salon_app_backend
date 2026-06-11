import{
    IsMobilePhone,
    IsOptional,
    IsString
} from 'class-validator'

export class SignInDto {

    @IsMobilePhone('en-IN')
    mobileNumber!: string;

    @IsOptional()
    @IsString()
    otp!:string 
            
}
