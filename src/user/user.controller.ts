import { Controller, Get, Post, Body, Patch, Param, Delete ,Req} from '@nestjs/common';
import {UserService} from './user.service'
import {UpdateUserDto} from "./dto/update-user.dto"
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Controller('user')
export class UserController {
 constructor(private userService: UserService) {}


  @UseGuards(AuthGuard('jwt'))
  @Patch("updateProfile")
  updateUserProfile(@Body() dto:UpdateUserDto, @Req() req : any){
  return this.userService.updateUserProfile(dto,req)
  }

  
 
}
