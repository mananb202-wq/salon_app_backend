import { Injectable ,BadRequestException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {BranchSchedule} from '../salon/entities/branch-schedule.entity'
import {BranchScheduleDto} from './dto/branch-schedule-dto'
import { BookingDto } from './dto/booking-slot.dto';
import { CustomerEntity } from '../customer/entities/create-customer.entity';
import { TeamMember } from '../team_member/entities/team_member.entity';
import { ConsumerService } from '../consumer_service/entities/consumer_service.entity';
import { BranchEntity } from '../salon/entities/branch.entity';
import { TeamMemberScheduleEntity } from '../team_member/entities/team_member-schedule.entity';
import { BookingEntity ,BookingItemType,BookingStatus } from './entities/booking.entity';
import { BookingReservation, ReservationStatus } from './entities/booking_reservation.entity';
import { PackageEntity } from '../packages/entities/package.entity';
import { DealsEntity } from '../deals/entities/create-deals.entity';
import { RazorpayService } from '../payment/razorpay.service';
import { PaymentEntity, PaymentStatus } from '../payment/entities/payment.entity';
import { OtpEntity } from '../salon/entities/otp.entity';
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

             @InjectRepository(BookingReservation)
             private BookingReservationRepo: Repository<BookingReservation>,
             
                 @InjectRepository(ConsumerService)
               private customerServiceRepo: Repository<ConsumerService>,

                    @InjectRepository(PackageEntity)
               private packageRepo: Repository<PackageEntity>,

                  @InjectRepository(PaymentEntity)
               private paymentRepo: Repository<PaymentEntity>,

                   @InjectRepository(DealsEntity)
               private dealRepo: Repository<DealsEntity>,

               
                    @InjectRepository(OtpEntity)
                     private otpRepo: Repository<OtpEntity>,
               

               private readonly razorpayService: RazorpayService,



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

private calculateEndTime(
  startTime: string,
  durationInMinutes: number,
): string {
  const [time, period] = startTime.split(' ');

  let [hours, minutes] = time
    .split(':')
    .map(Number);

  if (period === 'AM') {
    if (hours === 12) {
      hours = 0;
    }
  } else {
    if (hours !== 12) {
      hours += 12;
    }
  }

  const startMinutes =
    hours * 60 + minutes;

  const endMinutes =
    startMinutes + durationInMinutes;

  const endHours =
    Math.floor(endMinutes / 60) % 24;

  const remainingMinutes =
    endMinutes % 60;

  return `${String(endHours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}:00`;
}

private convertTo24HourFormat(
  time12h: string,
): string {
  const [time, modifier] =
    time12h.trim().split(' ');

  let [hours, minutes] = time
    .split(':')
    .map(Number);

  if (modifier === 'AM') {
    if (hours === 12) {
      hours = 0;
    }
  } else if (modifier === 'PM') {
    if (hours !== 12) {
      hours += 12;
    }
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
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

if (!dto.serviceIds || dto.serviceIds.length === 0) {
  throw new BadRequestException(
    'serviceIds is required',
  );
}

const service = await this.consumerServiceRepo.find({
  where: {
    id: In(dto.serviceIds),
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
        isWorking:true 
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


  let duration=0;
  let totalAmount=0;
  let bookingType;

  if(dto.serviceIds!== undefined && dto.packageId === undefined && dto.dealId === undefined){
 
    for(let i=0;i<dto.serviceIds.length;i++){
     
      const service= await this.customerServiceRepo.findOne({
      where:{
        id:dto.serviceIds[i]
      }
     });



    if (!service) {
       throw new BadRequestException(
        'Service not found',
       );
      }
     
    totalAmount+=Number(service.price);

    duration +=
      this.convertDurationToMinutes(
        service.duration
      );

    }

    bookingType=BookingItemType.SERVICE
    }


    if(dto.packageId!== undefined && dto.serviceIds !== undefined){

      const packageData= await this.packageRepo.findOne({
        where:{
          id:dto.packageId
        }  
        ,relations: {
         services: true,
       },
      })

      if(!packageData){
        throw new BadRequestException("package not found");
      }

       for(let i=0;i<dto.serviceIds.length;i++){
     
      const service= await this.customerServiceRepo.findOne({
      where:{
        id:dto.serviceIds[i]
      }
     });



    if (!service) {
       throw new BadRequestException(
        'Service not found',
       );
      }
     
    totalAmount+=Number(service.price);

    duration +=
      this.convertDurationToMinutes(
        service.duration
      );

    }

    
    bookingType=BookingItemType.PACKAGE
  }

      if(dto.dealId!== undefined  && dto.serviceIds !== undefined){

      const dealData= await this.dealRepo.findOne({
        where:{
          id:dto.dealId
        }
         ,relations: {
         services: true,
       },
      })

      if(!dealData){
        throw new BadRequestException("deal not found");
      }

    
       for(let i=0;i<dto.serviceIds.length;i++){
     
      const service= await this.customerServiceRepo.findOne({
      where:{
        id:dto.serviceIds[i]
      }
     });



    if (!service) {
       throw new BadRequestException(
        'Service not found',
       );
      }
     
    totalAmount+=Number(service.price);

    duration +=
      this.convertDurationToMinutes(
        service.duration
      );
    }
      bookingType=BookingItemType.DEAL
  }

   const reservations = await this.BookingReservationRepo.find({
    where: {
      bookingDate: dto.bookingDate,
      teamMember: {
        id: dto.teamMemberId,
      },
      status: In([
        ReservationStatus.RESERVED,
        ReservationStatus.CONFIRMED,
      ]),
    },
  });


  const newStart = this.convertTimeToMinutes(this.convertTo24HourFormat( dto.bookingTime,),);
  const newEnd = newStart + duration;

  for (const reservation of reservations) {
  const existingStart =
    this.convertTimeToMinutes(
      reservation.slotStartTime,
    );

  const existingEnd =
    this.convertTimeToMinutes(
      reservation.slotEndTime,
    );

  const overlap =
    newStart < existingEnd &&
    newEnd > existingStart;

  if (overlap) {
    throw new BadRequestException(
      'Slot already reserved',
    );
  }
}

  const reservedUntil = new Date(
  Date.now() + 10 * 60 * 1000,
);
  

const reservation = this.BookingReservationRepo.create({
    customer: {
      id: dto.customerId,
    },
    teamMember: {
      id: dto.teamMemberId,
    },
    branch: {
      id: dto.branchId,
    },
    slotStartTime:this.convertTo24HourFormat(dto.bookingTime),
    slotEndTime: this.calculateEndTime(dto.bookingTime,duration),
    status: ReservationStatus.RESERVED,
    reservedUntil,
    bookingDate:dto.bookingDate
  });

await this.BookingReservationRepo.save(reservation);

const occupiedSlots: string[] = [];

const bookingStart =
  this.convertTimeToMinutes(
  dto.bookingTime
  );

for (
  let time = bookingStart;
  time < bookingStart + duration;
  time += 15
) {
  occupiedSlots.push(
    this.convertMinutesToTime(time),
  );
}

if(dto.serviceIds!== undefined && (dto.packageId !== undefined || dto.dealId !== undefined)){
  
const getReservation = await this.BookingReservationRepo.findOne({
  where:{
    slotStartTime:dto.bookingTime,
    customer:{
      id:dto.customerId
    },
    teamMember:{
      id:dto.teamMemberId
    },
    status:ReservationStatus.RESERVED
  }
})

const payments = await this.paymentRepo.findOne({
    where: { reservation:{
    id : getReservation?.id
    } 
  }
   
  });



  reservation.status = ReservationStatus.CONFIRMED;
  await this.BookingReservationRepo.save(reservation);  

for(let i=0;i<dto.serviceIds.length; i++){
  const booking = this.bookingRepo.create({
  branch: { id: dto.branchId },
  service: { id: dto.serviceIds[i] },
  teamMember: { id: dto.teamMemberId },
  customer: { id: dto.customerId },
  dayId: { id: dto.dayId },
  bookingItemType: bookingType,
  bookingDate: dto.bookingDate,
  bookingTime: dto.bookingTime,
  payment: { 
    id: payments?.id },
});

if (dto.packageId) {
  booking.package = { id: dto.packageId } as any;
}

if (dto.dealId) {
  booking.deal = { id: dto.dealId } as any;
}

await this.bookingRepo.save(booking);
}
}

if(dto.serviceIds!== undefined && dto.packageId === undefined && dto.dealId === undefined){
const order = await this.razorpayService.createOrder(
    totalAmount,
    `reservation_${reservation.id}`,
  );



for(let i=0;i<dto.serviceIds.length;i++){

    const service= await this.customerServiceRepo.findOne({
      where:{
        id:dto.serviceIds[i]
      }
     });


const payment = this.paymentRepo.create({
  reservation: {
    id: reservation.id,
  },
  razorpayOrderId: order.id,
  amount:service?.price,
  status: PaymentStatus.PENDING,
  reservedUntil,
  service:{
    id:dto.serviceIds[i]
  }
});

await this.paymentRepo.save(payment);
}


return {
  success: true,
  message: 'Slot reserved, proceed to payment',
  data: {
    branchId: dto.branchId,
    service:dto.serviceIds,
    teamMemberId:dto.teamMemberId,
    customerId:dto.customerId,
    dayId:dto.dayId,
    BookingItemType:bookingType,
    dealId:dto.dealId,
    bookingDate:dto.bookingDate,
    bookingTime:dto.bookingTime,
    packageId:dto.packageId,
    reservationId: reservation.id,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    occupiedSlots
  },
};

}

}

async startJob(bookingId: number, body: any){

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
  const booking = await this.bookingRepo.findOne({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new BadRequestException('Booking not found');
  }

  if (booking.status === BookingStatus.CANCELLED) {
    throw new BadRequestException(
      'Cancelled booking cannot be started',
    );
  }

  if (booking.status === BookingStatus.COMPLETED) {
    throw new BadRequestException(
      'Booking is already completed',
    );
  }

  booking.status = BookingStatus.IN_PROCESS;

  await this.bookingRepo.save(booking);

  return {
    success: true,
    message: 'Job started successfully',
    data: booking,
  };

}

async endJob(bookingId: number) {
  const booking = await this.bookingRepo.findOne({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new BadRequestException('Booking not found');
  }

  if (booking.status === BookingStatus.CANCELLED) {
    throw new BadRequestException(
      'Cancelled booking cannot be completed',
    );
  }

  if (booking.status === BookingStatus.COMPLETED) {
    throw new BadRequestException(
      'Booking is already completed',
    );
  }

  if (booking.status !== BookingStatus.IN_PROCESS) {
    throw new BadRequestException(
      'Start the job before completing it',
    );
  }

  booking.status = BookingStatus.COMPLETED;

  await this.bookingRepo.save(booking);

  return {
    success: true,
    message: 'Job completed successfully',
    data: booking,
  };
}





    }
  


      
