import { Controller, Get, Post, Body, Patch, Param, Delete,ParseIntPipe } from '@nestjs/common';
import { DealsService } from './deals.service';
import {CreateDealDto} from './dto/create-deal.dto'
import {DeleteDealDto} from './dto/delete-deal.dto'
import {UpdateDealDto} from './dto/update-deal.dto'
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {BranchIdDto} from '../salon/dto/branch-id.dto'

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}


@UseGuards(AuthGuard('jwt'))
 @Post("create")
  createDeal(@Body() dto: CreateDealDto){
  return this.dealsService.createDeal(dto)
  }

@UseGuards(AuthGuard('jwt'))
@Delete('delete/:index')
deleteDeal(@Param('index',ParseIntPipe) index:number,@Body() dto:DeleteDealDto){
  return this.dealsService.deleteDeal(index,dto)
}

@UseGuards(AuthGuard('jwt'))
@Patch('update/:index')
updateDeal(@Param('index',ParseIntPipe) index:number,@Body() dto:UpdateDealDto){
  return this.dealsService.updateDeal(index,dto)
}


@UseGuards(AuthGuard('jwt'))
@Get('/')
getDeals(@Body() dto:BranchIdDto){
  return this.dealsService.getDeals(dto)
}


}
