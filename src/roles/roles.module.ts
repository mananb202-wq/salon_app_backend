import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module"
import {RoleEntity} from './entities/role.entity'

@Module({
   imports: [
        TypeOrmModule.forFeature([RoleEntity]),
          AuthModule,
      ],

  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}
