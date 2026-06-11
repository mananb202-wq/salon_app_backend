import { Controller, Get, Post, Body, Patch, Param, Delete,Req , ParseIntPipe,} from '@nestjs/common';
import { SalonService } from './salon.service';
import {CreateSalonDto} from "./dto/create-salon.dto"
import {CreateBranchDto} from './dto/create-branch.dto'
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {BranchServicesDto} from './dto/branch-services.dto';
import {BranchIdDto} from './dto/branch-id.dto'
import {UpdateBranchScheduleDto} from './dto/update-branch-schedule.dto'
import {MarkAsOffOnDay} from './dto/mark-off-on-day.dto'
import {UpdateSalonDto} from "./dto/update-salon.dto"
import {SalonIdDto} from './dto/salon-id.dto'
import {UpdateBranchDto} from './dto/update-branch.dto'

@Controller('salon')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}
    

  //salon routes
    @UseGuards(AuthGuard('jwt'))
    @Post('add')
    addSalon(@Body() dto:CreateSalonDto , @Req() req : any){
    return this.salonService.addSalon(dto,req)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('update')
    updateSalon(@Body() dto:UpdateSalonDto , @Req() req : any){
    return this.salonService.updateSalon(dto,req)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/delete/:salonIndex')
    deleteSalon(@Req() req : any,@Param('salonIndex',ParseIntPipe) salonIndex: number){
    return this.salonService.deleteSalon(req,salonIndex)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    getSalonDetails(@Req() req : any,@Body() dto:SalonIdDto){
    return this.salonService.getSalonDetails(req,dto)
    }


   //branch routes
    @UseGuards(AuthGuard('jwt'))
    @Post('add/branch/:salonIndex')
    addBranch(@Body() dto:CreateBranchDto , @Req() req : any, @Param('salonIndex',ParseIntPipe) salonIndex: number){
    return this.salonService.addBranch(dto,req,salonIndex)
    }
   
    @UseGuards(AuthGuard('jwt'))
    @Patch('update/branch/')
    updateBranch(@Body() dto:UpdateBranchDto){
    return this.salonService.updateBranch(dto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('branch')
    getBranchdetails(@Body() dto:BranchIdDto){
    return this.salonService.getBranchdetails(dto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('branch/delete/:salonIndex/:branchIndex')
    deleteBranch(@Req() req : any,@Param('salonIndex',ParseIntPipe) salonIndex: number, @Param('branchIndex',ParseIntPipe) branchIndex: number){
    return this.salonService.deleteBranch(req,salonIndex,branchIndex)
    }

   
    //branch-services routes
    @UseGuards(AuthGuard('jwt'))
    @Post('add/branch/services/:salonIndex/:branchIndex')
    addBranchServices(@Body() dto:BranchServicesDto[] , @Req() req : any, @Param('salonIndex',ParseIntPipe) salonIndex: number, @Param('branchIndex',ParseIntPipe) branchIndex: number){
    return this.salonService.addBranchServices(dto,req,salonIndex,branchIndex)
    }


    //branch-schedule routes  
   @UseGuards(AuthGuard('jwt'))
    @Get("branch/schedule/:salonIndex/:branchIndex")
    getBranchSchedule(@Req() req : any,@Param('salonIndex',ParseIntPipe) salonIndex: number,@Param('branchIndex',ParseIntPipe) branchIndex: number){
    return this.salonService.getBranchSchedule(req,salonIndex,branchIndex)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get("branch/schedule")
    getBranchScheduleUsingID(@Body() dto:BranchIdDto){
    return this.salonService.getBranchScheduleUsingId(dto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch("branch/schedule/:salonIndex/:branchIndex")
    updateBranchSchedule(@Req() req : any,@Body() dto :UpdateBranchScheduleDto , @Param('salonIndex',ParseIntPipe) salonIndex: number,@Param('branchIndex',ParseIntPipe) branchIndex: number){
    return this.salonService.updateBranchSchedule(req,dto,salonIndex,branchIndex)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch("branch/schedule")
    updateBranchScheduleUsingId(@Body() dto :UpdateBranchScheduleDto){
    return this.salonService.updateBranchScheduleUsingId(dto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch("branch/schedule/isOpen")
    markAsOffandOnWorkingDay(@Body() dto :MarkAsOffOnDay){
    return this.salonService.markAsOffandOnWorkingDay(dto)
    }
  
}
