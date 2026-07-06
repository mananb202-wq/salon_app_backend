import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { BookingReservation, ReservationStatus } from './entities/booking_reservation.entity';


@Injectable()
export class ReservationSchedulerService {
  constructor(
    @InjectRepository(BookingReservation)
    private readonly reservationRepo: Repository<BookingReservation>,
  ) {}

  @Cron('* * * * *') 
  async handleExpiredReservations() {
    const now = new Date();

    const expired = await this.reservationRepo.find({
      where: {
        status: ReservationStatus.RESERVED,
        reservedUntil: LessThan(now),
      },
    });

    for (const reservation of expired) {
      reservation.status = ReservationStatus.EXPIRED;
    }

    await this.reservationRepo.save(expired);

    console.log(`Expired ${expired.length} reservations`);
  }

 
}