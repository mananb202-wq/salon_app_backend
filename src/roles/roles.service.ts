import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {RoleEntity} from "./entities/role.entity"
import {Repository} from "typeorm";


@Injectable()
export class RolesService {

  constructor(
        @InjectRepository(RoleEntity)
        private roleRepo: Repository<RoleEntity>,
  ){}

  async seedRoles() {
    
  const roles = [
      "SALON MANAGER",
      "STYLIST"
    ];

    for (const roleName of roles) {

      const existingRole =
        await this.roleRepo.findOne({
          where: {
            name: roleName,
          },
        });

      if (!existingRole) {

        const role =
          this.roleRepo.create({
            name: roleName,
          });

        await this.roleRepo.save(role);
      }
    }
  }

}
