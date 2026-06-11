import { Injectable ,BadRequestException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {BranchSchedule} from '../salon/entities/branch-schedule.entity'
import {BranchScheduleDto} from './dto/branch-schedule-dto'
import { BookingDto } from './dto/booking-slot.dto';
import { CustomerEntity } from '../customer/entities/create-customer.entity';
import { TeamMember } from '../team_member/entities/team_member.entity';
import { ConsumerService } from '../consumer_service/entities/consumer_service.entity';
import { BranchEntity } from '../salon/entities/branch.entity';
import { TeamMemberScheduleEntity } from '../team_member/entities/team_member-schedule.entity';
import { BookingEntity ,BookingStatus } from './entities/booking.entity';
@Injectable()
export class BookingService {
      constructor(
         @InjectRepository(BranchSchedule)
          private branchServiceRepo: Repository<BranchSchedule>,

           @InjectRepository(CustomerEntity)
          private customerRepo: Repository<CustomerEntity>,

           @InjectRepository(TeamMember)
          private teamMemberRepo: Repository<TeamMember>,

            @InjectRepository(ConsumerService)
          private consumerServiceRepo: Repository<ConsumerService>,

          
            @InjectRepository(BranchEntity)
          private branchRepo: Repository<BranchEntity>,

             @InjectRepository(TeamMemberScheduleEntity)
          private teamMemberScheduleRepo: Repository<TeamMemberScheduleEntity>,

               @InjectRepository(BookingEntity)
          private bookingRepo: Repository<BookingEntity>,



      ){}


convertTimeToMinutes(branchTime: string): number {
  const [time, period] = branchTime.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  }

  if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;

}

convertDurationToMinutes(
  duration: string,
): number {

  const [hours, minutes] =
    duration.split(':').map(Number);

  return hours * 60 + minutes;
}

convertMinutesToTime(totalMinutes: number): string {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;

  if (hours === 0) {
    hours = 12;
  }

  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${hours}:${formattedMinutes} ${period}`;
}

    async getBranchSlot(dto:BranchScheduleDto){
        
        const slotIntervalTimeInMin=15;
        const slots: string[] = [];


        const getBranchSchedule = await this.branchServiceRepo.findOne({
            where:{
            branch:{
                id:dto.branchId
            },
            workingday:{
                id:dto.dayId
            }
        }
        });

        const branchOpeningTime=getBranchSchedule?.Opening_Timmings;
        const branchClosingTime= getBranchSchedule?.Closing_Timmings;
        let branchClosingTimeInMin=this.convertTimeToMinutes(branchClosingTime!)
        const branchOpeningTimeInMin= this.convertTimeToMinutes(branchOpeningTime!)
        let currentTime= branchOpeningTimeInMin;
        slots.push(branchOpeningTime!);

        if (branchClosingTimeInMin < branchOpeningTimeInMin) {
            branchClosingTimeInMin += 1440;
            }

        if(branchOpeningTimeInMin<branchClosingTimeInMin){
        while(currentTime<branchClosingTimeInMin){

            let slotTimeInMin=currentTime+slotIntervalTimeInMin;
            currentTime=slotTimeInMin;
            let slotTimeInHours=this.convertMinutesToTime(currentTime % 1440);
            slots.push(slotTimeInHours)
            
        }
    }

    return{
        "success":true,
        "message":"slots send",
        data:slots
    }
    }
async bookSlot( dto:BookingDto){
    
  const customer = await this.customerRepo.findOne({
    where: {
      id: dto.customerId,
    },
  });

  if (!customer) {
    throw new BadRequestException(
      'Customer not found',
    );
  }

  const teamMember = await this.teamMemberRepo.findOne({
    where: {
      id: dto.teamMemberId,
    },
  });

  if (!teamMember) {
    throw new BadRequestException(
      'Team member not found',
    );
  }

  const service = await this.consumerServiceRepo.findOne({
    where: {
      id: dto.serviceId,
    },
  });

  if (!service) {
    throw new BadRequestException(
      'Service not found',
    );
  }

  const branch = await this.branchRepo.findOne({
    where: {
      id: dto.branchId,
    },
  });

  if (!branch) {
    throw new BadRequestException(
      'Branch not found',
    );
  }



  const teamMemberSchedule =
    await this.teamMemberScheduleRepo.findOne({
      where: {
        teamMember: {
          id: dto.teamMemberId,
        },
        workingDay: {
          id: dto.dayId,
        },
      },
    });

  if (!teamMemberSchedule) {
    throw new BadRequestException(
      'No schedule found for this team member',
    );
  }

  if (!teamMemberSchedule.isWorking) {
    throw new BadRequestException(
      'Team member is not working on this day',
    );
  }

  let bookingTimeInMin =
    this.convertTimeToMinutes(
      dto.bookingTime,
    );

  let openingTimeInMin =
    this.convertTimeToMinutes(
      teamMemberSchedule.openingTime,
    );

  let closingTimeInMin =
    this.convertTimeToMinutes(
      teamMemberSchedule.closingTime,
    );

  if (
    closingTimeInMin <
    openingTimeInMin
  ) {
    closingTimeInMin += 1440;

    if (
      bookingTimeInMin <
      openingTimeInMin
    ) {
      bookingTimeInMin! += 1440;
    }
  }

  if (
    bookingTimeInMin <
      openingTimeInMin ||
    bookingTimeInMin >
      closingTimeInMin
  ) {
    throw new BadRequestException(
      'Selected slot is outside working hours',
    );
  }

  const existingBooking =
    await this.bookingRepo.findOne({
      where: {
        bookingDate: dto.bookingDate,
        bookingTime: dto.bookingTime,
        teamMember: {
          id: dto.teamMemberId,
        },
      },
    });

  if (existingBooking) {
    throw new BadRequestException(
      'Slot already booked',
    );
  }

  const booking =
    this.bookingRepo.create({
      customer: {
        id: dto.customerId,
      },
      teamMember: {
        id: dto.teamMemberId,
      },
      service: {
        id: dto.serviceId,
      },
      branch: {
        id: dto.branchId,
      },
      bookingDate: dto.bookingDate,
      bookingTime: dto.bookingTime,
      status: BookingStatus.CONFIRMED,
      dayId:{
        id:dto.dayId
      }

    });

  await this.bookingRepo.save(
    booking,
  );
 
  const getBooking = await this.bookingRepo.findOne({
    where:{
      id:booking.id
    },
    relations:{
      branch:true,
      service:true,
      teamMember:true,
      customer:true,
      dayId:true
    }
  });


  const occupiedSlots: string[] = [];

const bookingStart =
  this.convertTimeToMinutes(
    booking.bookingTime,
  );

const duration =
  this.convertDurationToMinutes(service.duration);

for (
  let time = bookingStart;
  time < bookingStart + duration;
  time += 15
) {
  occupiedSlots.push(
    this.convertMinutesToTime(time),
  );
}

  return {
    success: true,
    message:
      'Booking created successfully',
    data:{getBooking,
        slots:occupiedSlots
    }

  };
        

        
    }

}
