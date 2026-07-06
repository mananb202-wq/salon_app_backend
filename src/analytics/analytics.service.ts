import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity, BookingItemType } from '../booking/entities/booking.entity';


@Injectable()
export class AnalyticsService {

constructor(

  @InjectRepository(BookingEntity)
  private bookingRepo: Repository<BookingEntity>,
  ){}


  async getBranchBookings(
  branchId: number,
  filter: 'day' | 'week' | 'month' | 'year',
) {
  let startDate = new Date();
  let endDate = new Date();

  switch (filter) {
    case 'day':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'week':
      startDate.setDate(startDate.getDate() - startDate.getDay());
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'month':
      startDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1,
      );

      endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      break;

    case 'year':
      startDate = new Date(startDate.getFullYear(), 0, 1);

      endDate = new Date(
        startDate.getFullYear(),
        11,
        31,
        23,
        59,
        59,
        999,
      );
      break;
  }

  return await this.bookingRepo
    .createQueryBuilder('booking')
    .leftJoinAndSelect('booking.customer', 'customer')
    .leftJoinAndSelect('booking.service', 'service')
    .leftJoinAndSelect('booking.teamMember', 'teamMember')
    .where('booking.branchId = :branchId', {
      branchId,
    })
    .andWhere(
      'booking.bookingDate BETWEEN :startDate AND :endDate',
      {
        startDate,
        endDate,
      },
    )
    .orderBy('booking.bookingDate', 'ASC')
    .addOrderBy('booking.bookingTime', 'ASC')
    .getMany();
}

async getBranchRevenue(
  branchId: number,
  filter: 'day' | 'week' | 'month' | 'year',
) {
  let startDate = new Date();
  let endDate = new Date();

  switch (filter) {
    case 'day':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'week':
      // Monday as first day of week
      const day = startDate.getDay();
      const diff = day === 0 ? -6 : 1 - day;

      startDate.setDate(startDate.getDate() + diff);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'month':
      startDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1,
      );
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0,
      );
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'year':
      startDate = new Date(
        startDate.getFullYear(),
        0,
        1,
      );
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(
        startDate.getFullYear(),
        11,
        31,
      );
      endDate.setHours(23, 59, 59, 999);
      break;
  }


  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const start = formatDate(startDate);
  const end = formatDate(endDate);


  const payments = await this.bookingRepo
    .createQueryBuilder('booking')
    .leftJoin('booking.payment', 'payment')
    .select('payment.id', 'paymentId')
    .addSelect('payment.amount', 'amount')
    .distinct(true)
    .where('booking.branchId = :branchId', { branchId })
    .andWhere('booking.bookingItemType = :type', {
      type: BookingItemType.SERVICE,
    })
    .andWhere(
      'booking.bookingDate BETWEEN :start AND :end',
      {
        start,
        end,
      },
    )
    .getRawMany();

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );

  return {
    success: true,
    branchId,
    filter,
    startDate: start,
    endDate: end,
    totalRevenue,
    uniquePayments: payments.length,
  };
}
}
