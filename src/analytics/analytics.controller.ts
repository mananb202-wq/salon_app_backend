import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('analytics')
export class AnalyticsController {

   constructor(private readonly analyticsService: AnalyticsService) {}
  
   @UseGuards(AuthGuard('jwt'))
   @Get('branch/:branchId/bookings')
  getBranchBookings(
    @Param('branchId', ParseIntPipe) branchId: number,
    @Query('filter')
    filter: 'day' | 'week' | 'month' | 'year',
  ) {
    return this.analyticsService.getBranchBookings(
      branchId,
      filter,
    );
  }

@UseGuards(AuthGuard('jwt'))
  @Get('branch/:branchId/revenue')
  getBranchRevenue(
    @Param('branchId', ParseIntPipe) branchId: number,
    @Query('filter')
    filter: 'day' | 'week' | 'month' | 'year',
  ) {
    return this.analyticsService.getBranchRevenue(
      branchId,
      filter,
    );
  }
}



