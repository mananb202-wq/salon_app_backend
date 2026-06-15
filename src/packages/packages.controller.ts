import { Controller, Get, Post, Body, Patch, Param, Delete,Req, ParseIntPipe } from '@nestjs/common';
import { PackagesService } from './packages.service';
import {CreatePackage} from './dto/create-package.dto'
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {BranchIdDto} from '../salon/dto/branch-id.dto'
import {UpdatePackageDto} from '../packages/dto/update-package.dto'


@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post("add")
  addPackage(@Body() dto:CreatePackage,@Req() req:any ){
  return this.packagesService.addPackage(dto,req)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  getPackages(@Body() dto:BranchIdDto){
    return this.packagesService.getPackage(dto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/package/:packageId')
  deletePackages(@Param("packageId",ParseIntPipe) packageId:number ){
    return this.packagesService.deletePackage(packageId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/update/:packageId')
  updatePackages(@Param("packageId",ParseIntPipe) packageId:number ,@Body() dto: UpdatePackageDto){
    return this.packagesService.updatePackage(packageId,dto)
  }

  
  @UseGuards(AuthGuard('jwt'))
  @Post('/buy/:packageId/:customerId')
  buyPackage(@Param("packageId",ParseIntPipe) packageId:number ,@Param("customerId",ParseIntPipe) customerId:number ){
    return this.packagesService.buyPackage(packageId,customerId)
  }

  



}
