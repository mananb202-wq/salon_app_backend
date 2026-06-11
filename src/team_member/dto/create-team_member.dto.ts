import{
IsNotEmpty,
IsMobilePhone,
IsEmail,
} from 'class-validator';

import {BranchEntity} from '../../salon/entities/branch.entity'

export class CreateTeamMemberDto {

@IsNotEmpty()
firstName!: string;

@IsNotEmpty()
lastName!: string;

@IsEmail()
email!:string;

@IsMobilePhone('en-IN')
mobileNumber!: string;

@IsNotEmpty()
roleID!:number
}
