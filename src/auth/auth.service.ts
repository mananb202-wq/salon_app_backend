import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import { User } from '../user/entities/user.entity'
import {CreateUserDto} from "../user/dto/create-user.dto"
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import {OtpEntity} from '../salon/entities/otp.entity'


@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

     @InjectRepository(OtpEntity)
      private otpRepo: Repository<OtpEntity>,

    private jwtService: JwtService,
  ){}

 async userIn(body:any){
  
  const existingUser = await this.userRepo.findOne({
    where:{
      mobile_number:body.mobileNumber
    }
  });
   if(body.otp!= null){
    
   const verifyOtp = await this.otpRepo.findOne({
    where:{
      Otp:body.otp
    }
  });
  
  
  if(!verifyOtp){
   throw new BadRequestException("incorrect otp")
  }
}


  if(existingUser){
  const payload={
  userId:existingUser.id
 }

 const token = await this.jwtService.signAsync(payload);

   return{
    success:true,
    message:"you are in",
    data:{
        accessToken:token
      }
}
}

 if (!existingUser) {
   
  if (!body.firstName || !body.lastName || !body.email) {
    return {
      success: false,
      message: "Signup data required",
      needsSignup: true
    };
  }
  
  await this.validateSignup(body);
}

    const user= await this.userRepo.create({
     first_name:body.firstName,
     last_name:body.lastName,
     mobile_number:body.mobileNumber,
     email:body.email

  });
  await this.userRepo.save(user);

 const payload={
  userId:user.id
 }

 const token = await this.jwtService.signAsync(payload);

   return{
    success:true,
    message:"you are in",
    data:{
        accessToken:token
      }
}
 
}

  async validateSignup(body: any) {
    const dto = plainToInstance(CreateUserDto, body);
    await validateOrReject(dto);
  }

}
