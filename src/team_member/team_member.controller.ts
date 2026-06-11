import { Controller, Get, Post, Body, Patch, Param, Delete,Req,ParseIntPipe } from '@nestjs/common';
import { TeamMemberService } from './team_member.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {CreateTeamMemberDto} from './dto/create-team_member.dto';
import {AssignTeamMemberServicesDto} from './dto/assigned-team_member-service.dto';
import {UpdateTeamMemberDto} from './dto/update-team_member.dto'
import {DeleteTeamMemberDto} from './dto/delete-team_member.dto';
import { TeamMemberScheduleDto } from './dto/team_member-schedule.dto';



@Controller('team-member')
export class TeamMemberController {
  constructor(private readonly teamMemberService: TeamMemberService) {}

@UseGuards(AuthGuard('jwt'))
@Post('add/:salonIndex/:branchIndex')
addTeamMember(@Body() dto:CreateTeamMemberDto, @Req() req : any, @Param('salonIndex',ParseIntPipe) salonIndex: number, @Param('branchIndex',ParseIntPipe) branchIndex: number){
return this.teamMemberService.addTeamMember(dto,req,salonIndex,branchIndex)
}

@UseGuards(AuthGuard('jwt'))
@Post('add/services')
addTeamMemberServices(@Body() dto: AssignTeamMemberServicesDto ,@Req() req : any){
return this.teamMemberService.addTeamMemberSevices(dto,req)
}

@UseGuards(AuthGuard('jwt'))
@Delete('delete')
deleteTeamMember(@Body() dto:DeleteTeamMemberDto){
return this.teamMemberService.deleteTeamMember(dto)
}

@UseGuards(AuthGuard('jwt'))
@Patch('update')
updateTeamMember(@Body() dto:UpdateTeamMemberDto){
return this.teamMemberService.updateTeamMember(dto)
}

@UseGuards(AuthGuard('jwt'))
@Post('add/schedule')
addTeamMemberSchedule(@Body() dto: TeamMemberScheduleDto){
return this.teamMemberService.addTeamMemberSchedule(dto)
}



}
