import { BadRequestException, Injectable ,NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import{CreateUserDto} from "./dto/create-user.dto"

import {User} from './entities/user.entity'
import {UpdateUserDto} from "./dto/update-user.dto"

@Injectable()
export class UserService {

  constructor(
   @InjectRepository(User)
    private userRepo: Repository<User>,
  ){}
 
  async updateUserProfile(dto:UpdateUserDto,req : any){

    const userId=req.user.userId;

    const user = await this.userRepo.findOne({
    where: { id: userId }
     });

       if (!user) {
    throw new NotFoundException('User not found');
       }

  if (dto.firstName!== undefined) user.first_name = dto.firstName;
  if (dto.email !== undefined) user.email = dto.email;
  if (dto.lastName !== undefined) user.last_name = dto.lastName;
  if(dto.mobileNumber !== undefined) user.mobile_number=dto.mobileNumber;
  
  

  const updatedUserProfile= await this.userRepo.save(user);

      return{
        success:true,
        message:"profile is updated",
        data:updatedUserProfile
      }

  }






    
    

  }



