import { BadRequestException, Injectable } from "@nestjs/common";
import { RazorpayService } from "./razorpay.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaymentEntity, PaymentStatus } from "./entities/payment.entity";
import { BookingReservation, ReservationStatus } from "../booking/entities/booking_reservation.entity";
import { BookingEntity } from "../booking/entities/booking.entity";
import { BuyPackageEntity } from "../packages/entities/buy-package.entity";
import { PackageEntity } from "../packages/entities/package.entity";
import { DealsEntity } from "../deals/entities/create-deals.entity";
import { BuyDealEntity } from "../deals/entities/buy-deal.entity";

@Injectable()
export class PaymentService {
  constructor(
    private readonly razorpayService: RazorpayService,
         @InjectRepository(PaymentEntity)
          private paymentRepo: Repository<PaymentEntity>,

        @InjectRepository(BookingReservation)
        private BookingReservationRepo: Repository<BookingReservation>,

       @InjectRepository(BookingEntity)
        private BookingRepo: Repository<BookingEntity>,

           
      @InjectRepository(BuyPackageEntity)
      private buyPackageRepo: Repository<BuyPackageEntity>,

      @InjectRepository(PackageEntity)
      private packageRepo: Repository<PackageEntity>,

      @InjectRepository(DealsEntity)
            private dealsRepo: Repository<DealsEntity>,

      @InjectRepository(BuyDealEntity)
      private buyDealsRepo: Repository<BuyDealEntity>

  ) {}

  async createTestOrder() {
    return this.razorpayService.createOrder(
      100,
      'test_receipt',
    );
  }

  async handleMockSuccess(body: any) {
  
  
  const orderId = body.orderId;

  const payments = await this.paymentRepo.find({
    where: { razorpayOrderId: orderId },
    relations: {
      reservation:true
    }
  });

  if (payments.length === 0) {
    throw new BadRequestException('Payment not found');
  }
 
for (const payment of payments) {
  payment.status = PaymentStatus.SUCCESS;
  payment.razorpayPaymentId =
    `mock_payment_${Date.now()}`;

  await this.paymentRepo.save(payment);
}

if(body.reservationId !== undefined){

  const reservation = payments[0].reservation;
  reservation.status = ReservationStatus.CONFIRMED;
  await this.BookingReservationRepo.save(reservation);  

for(let i=0;i<body.serviceId.length; i++){
  const booking = this.BookingRepo.create({
  branch: { id: body.branchId },
  service: { id: body.serviceId[i] },
  teamMember: { id: body.teamMemberId },
  customer: { id: body.customerId },
  dayId: { id: body.dayId },
  bookingItemType: body.BookingItemType,
  bookingDate: body.bookingDate,
  bookingTime: body.bookingTime,
  payment: { id: payments[i].id },
});

if (body.packageId) {
  booking.package = { id: body.packageId } as any;
}

if (body.dealId) {
  booking.deal = { id: body.dealId } as any;
}

await this.BookingRepo.save(booking);
}
return {
    success: true,
    message: 'Mock payment success processed', 
  };
}

if (body.packageId && body.reservationId === undefined) {

   const packageData= await this.packageRepo.findOne({
  where:{
    id:body.packageId
  },
    relations: {
    services: true,
  },
 });
 if (!packageData) {
  throw new BadRequestException('Package not found');
}

 const serviceIDs = packageData?.services.map(service => service.id);
let packageService;
for (const serviceId of serviceIDs) {
   packageService = this.buyPackageRepo.create({
    package: {
      id: body.packageId,
    },
    services: {
      id: serviceId,
    },
    costomer: {
      id: body.customerId,
    },
    expiresAt:body.expiresAt,
  });

  await this.buyPackageRepo.save(packageService);
}


  return {
    success: true,
    message: 'Mock payment success processed',
    data:packageService
  };
}

if (body.dealId && body.reservationId === undefined) {

const dealExists= await this.dealsRepo.findOne({
       where : {
         id:body.dealId,
       },
         relations: {
    services: true,
  },
      });

      if(!dealExists){
         throw new BadRequestException(
        'deal does not exists',
      );
    }


 const serviceIDs = dealExists?.services.map(service => service.id);
let dealServices
for (const serviceId of serviceIDs) {
  dealServices = this.buyDealsRepo.create({
    deal: {
      id: body.dealId,
    },
    services: {
      id: serviceId,
    },
    customer: {
      id: body.customerId,
    },
    expiresAt:body.expiresAt,
  });

  await this.buyDealsRepo.save(dealServices);
}

  return {
    success: true,
    message: 'Mock payment success processed',
    data:dealServices
  };
}


}
}
