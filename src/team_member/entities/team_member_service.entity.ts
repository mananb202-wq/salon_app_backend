import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import {TeamMember} from "./team_member.entity"
import {ConsumerService} from "../../consumer_service/entities/consumer_service.entity"


@Entity('teamMember_service')
export class TeamMemberServiceEntity{
      @PrimaryGeneratedColumn()
      id!: number;
    
      @ManyToOne(
        () => TeamMember,
        {
      onDelete: 'CASCADE',
        },
      )
      @JoinColumn({
        name: 'teamMemberId',
      })
      teamMember!: TeamMember;
    
      @ManyToOne(
        () => ConsumerService,
      )
      @JoinColumn({
        name: 'serviceId',
      })
      service!: ConsumerService;
}

