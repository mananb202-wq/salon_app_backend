import { Module } from '@nestjs/common';
import { TeamMemberService } from './team_member.service';
import { TeamMemberController } from './team_member.controller';
import {AuthModule} from "../auth/auth.module"
import {BranchEntity} from "../salon/entities/branch.entity"
import {Salon}from '../salon/entities/salon.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import {TeamMember} from './entities/team_member.entity'
import {TeamMemberServiceEntity} from "./entities/team_member_service.entity"
import {ConsumerService} from "../consumer_service/entities/consumer_service.entity"
import {BranchService} from '../salon/entities/branch-sevices.entity'
import { TeamMemberScheduleEntity } from './entities/team_member-schedule.entity';
import { BranchSchedule } from '../salon/entities/branch-schedule.entity';


@Module({

     imports: [
        TypeOrmModule.forFeature([Salon,BranchEntity,TeamMember,TeamMemberServiceEntity,ConsumerService,BranchService,TeamMemberScheduleEntity,BranchSchedule]),
          AuthModule,
      ],
  controllers: [TeamMemberController],
  providers: [TeamMemberService],
})
export class TeamMemberModule {}
