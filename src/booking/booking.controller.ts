import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BookingService } from './booking.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BranchScheduleDto } from './dto/branch-schedule-dto';
import { BookingDto } from './dto/booking-slot.dto';



@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

@UseGuards(AuthGuard('jwt'))
@Get("/slot")
getBranchSlot(@Body() dto:BranchScheduleDto){
  return this.bookingService.getBranchSlot(dto)
}

@UseGuards(AuthGuard('jwt'))
@Post("/slot")
bookSlot(@Body() dto:BookingDto){
  return this.bookingService.bookSlot(dto)
}

@UseGuards(AuthGuard('jwt'))
@Patch("/startJob/:bookingId")
startJob(@Param('bookingId',ParseIntPipe) bookingId: number, @Body() body: any){
  return this.bookingService.startJob(bookingId,body)
}

@UseGuards(AuthGuard('jwt'))
@Patch('/endJob/:bookingId')
endJob(
  @Param('bookingId', ParseIntPipe) bookingId: number) {
  return this.bookingService.endJob(bookingId);
}

}
