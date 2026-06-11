import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module"
import {BranchSchedule} from '../salon/entities/branch-schedule.entity'
import { CustomerEntity } from '../customer/entities/create-customer.entity';
import { TeamMember } from '../team_member/entities/team_member.entity';
import { ConsumerService } from '../consumer_service/entities/consumer_service.entity';
import { BranchEntity } from '../salon/entities/branch.entity';
import { TeamMemberScheduleEntity } from '../team_member/entities/team_member-schedule.entity';
import { BookingEntity } from './entities/booking.entity';


@Module({
    imports: [
          TypeOrmModule.forFeature([BranchSchedule,CustomerEntity,TeamMember,ConsumerService,BranchEntity,TeamMemberScheduleEntity,BookingEntity]),
            AuthModule,
        ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
