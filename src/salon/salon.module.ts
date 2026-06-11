import { Module } from '@nestjs/common';
import { SalonService } from './salon.service';
import { SalonController } from './salon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Salon} from "./entities/salon.entity"
import {AuthModule} from "../auth/auth.module"
import {BranchEntity} from "./entities/branch.entity"
import {BranchService} from './entities/branch-sevices.entity'
import {WorkingDays} from './entities/working-days.entity'
import {BranchSchedule} from './entities/branch-schedule.entity'
import {ConsumerService} from '../consumer_service/entities/consumer_service.entity'
import {OtpEntity} from './entities/otp.entity'

@Module({
    imports: [
      TypeOrmModule.forFeature([Salon,BranchEntity,BranchService,WorkingDays,BranchSchedule,ConsumerService,OtpEntity]),
        AuthModule,
    ],
  controllers: [SalonController],
  providers: [SalonService],
  exports:[SalonService]
})
export class SalonModule {}
