import { Module } from '@nestjs/common';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module"
import {DealTypeEntity} from './entities/deal-type.entity';
import {DealsEntity} from './entities/create-deals.entity'



@Module({

   imports: [
        TypeOrmModule.forFeature([DealTypeEntity,DealsEntity]),
          AuthModule,
      ],
  controllers: [DealsController],
  providers: [DealsService],
   exports:[DealsService]
})
export class DealsModule {}
