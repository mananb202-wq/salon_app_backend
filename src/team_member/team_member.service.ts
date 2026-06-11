import { Injectable,BadRequestException,NotFoundException } from '@nestjs/common';
import {CreateTeamMemberDto} from './dto/create-team_member.dto'
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Salon} from "../salon/entities/salon.entity"
import {BranchEntity} from "../salon/entities/branch.entity"
import {TeamMember} from "./entities/team_member.entity"
import {AssignTeamMemberServicesDto} from './dto/assigned-team_member-service.dto'
import {TeamMemberServiceEntity} from '../team_member/entities/team_member_service.entity'
import {DeleteTeamMemberDto} from './dto/delete-team_member.dto'
import {UpdateTeamMemberDto} from './dto/update-team_member.dto'
import {ConsumerService} from '../consumer_service/entities/consumer_service.entity'
import {BranchService} from '../salon/entities/branch-sevices.entity'
import { TeamMemberScheduleDto } from './dto/team_member-schedule.dto';
import { TeamMemberScheduleEntity } from './entities/team_member-schedule.entity';



@Injectable()
export class TeamMemberService {
constructor(
              @InjectRepository(Salon)
              private salonRepo: Repository<Salon>,
      
               @InjectRepository(BranchEntity)
              private branchRepo: Repository<BranchEntity>,

                @InjectRepository(TeamMember)
              private teamMemberRepo: Repository<TeamMember>,

               @InjectRepository(TeamMemberServiceEntity)
              private teamMemberServiceRepo: Repository<TeamMemberServiceEntity>,

              @InjectRepository(ConsumerService)
              private customerServiceRepo: Repository<ConsumerService>,
              
              @InjectRepository(BranchService)
              private branchServiceRepo: Repository<BranchService>,
                 
              @InjectRepository(TeamMemberScheduleEntity)
              private teamMemberScheduleRepo: Repository<TeamMemberScheduleEntity>,

       ){}

  async addTeamMember(dto:CreateTeamMemberDto , req : any, salonIndex: number ,branchIndex: number ){
      
       const userId=req.user.userId;
   
       const SalonData= await this.salonRepo.find({
         where:{
           user:{
           id:userId
           }
         }
       });
      
       if(!SalonData){
         throw new BadRequestException("salon not found")
       }
       const salonIds = SalonData.map(
        (salon) => salon.id,
       );
   
       const selectedSalonId=salonIds[salonIndex];
   
       const branchData= await this.branchRepo.find({
         where:{
           salon:{
           id:selectedSalonId
           }
         }
       });
   
         if(!branchData){
         throw new BadRequestException("branches not found")
       }
   
        const branchIds = branchData.map(
        (salon) => salon.id,
       );
   
       const selectedBranchId= branchIds[branchIndex];


       const teamMemberExists=await this.teamMemberRepo.findOne({
        where:{
          mobile_number:dto.mobileNumber,
          branch:{
            id:selectedBranchId
          }
        }
       });

       if(teamMemberExists){
        throw new BadRequestException("Member already exixsts in this branch")
       }
       
       const teamMember= await this.teamMemberRepo.create({
        first_name:dto.firstName,
        last_name:dto.lastName,
        mobile_number:dto.mobileNumber,
        email:dto.email,
        role:{
          id:dto.roleID
        },
        branch:{
          id:selectedBranchId
        }
       })

       await this.teamMemberRepo.save(teamMember);

       return {
        success:true,
        message:"team member is added"
       }

  }

  async addTeamMemberSevices(dto: AssignTeamMemberServicesDto,req : any){

    const teamMemberExists = await this.teamMemberRepo.findOne({
      where:{id:dto.teamMemberId},
     relations: {
    branch: true,
  },
    }
  );



    if(!teamMemberExists){
      throw new BadRequestException("team memeber not exists")
    }

      for (const item of dto.services){

      const getService= await this.customerServiceRepo.find({
        where:{
          category:{
            id:item.categoryId 
          }

        }
      })

      if(getService.length === 0){
        throw new NotFoundException("services not found")
      }
      
      for (const service of getService){

        const serviceExists= await this.branchServiceRepo.findOne({
        where:{
          service:{
            id:service.id
          },
          branch:{
            id:teamMemberExists.branch.id
          },
        }
      });

      console.log(serviceExists)

       console.log(teamMemberExists.branch.id)
      const addTeamMemberService= await this.teamMemberServiceRepo.create({
        teamMember:{
       id:teamMemberExists.id
        },
        service:{
          id:service.id
        }
      });

      await this.teamMemberServiceRepo.save(addTeamMemberService)

      }

}


  return {
    success:true,
    message:"Services to the team memeber is added"
  }
  }

async deleteTeamMember(dto:DeleteTeamMemberDto){
const result=await this.teamMemberRepo.delete(dto.id);

 if (result.affected === 0) {
    throw new NotFoundException(
      'Team member not found',
    );
  }

  return {
    message: 'Deleted successfully',
  };
}


async updateTeamMember(dto:UpdateTeamMemberDto){
const teamMember =
    await this.teamMemberRepo.findOne({
      where: {
        id:dto.teamMemberID,
      },
    });


      if (!teamMember) {
    throw new NotFoundException(
      'Team member not found',
    );
  }


  Object.assign(
    teamMember,
    {
      first_name: dto.firstName,

      last_name: dto.lastName,

      email: dto.email,

      mobile_number:
        dto.mobileNumber,

      role: dto.roleID
        ? {
            id: dto.roleID,
          }
        : teamMember.role,
    },
  );

  await this.teamMemberRepo.save(
    teamMember,
  );

  return {
    message:
      'Team member updated successfully',
  };


}

async addTeamMemberSchedule(dto: TeamMemberScheduleDto){

  const scheduleExists =
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
 
  if (scheduleExists) {
    throw new BadRequestException(
      'Schedule already exists for this day',
    );
  }

  const schedule =
    this.teamMemberScheduleRepo.create({
      teamMember: {
        id: dto.teamMemberId,
      },
      workingDay: {
        id: dto.dayId,
      },
      openingTime: dto.openingTime,
      closingTime: dto.closingTime,
      isWorking: dto.isWorking,
    });

  await this.teamMemberScheduleRepo.save(
    schedule,
  );

  return {
    success: true,
    message:
      'Team member schedule created successfully',
    data: schedule,
  };
  
}


}



