import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module"
import {PackageEntity} from './entities/package.entity'
import {ConsumerService} from '../consumer_service/entities/consumer_service.entity'
import { BuyPackageEntity } from './entities/buy-package.entity';



@Module({
  imports: [
        TypeOrmModule.forFeature([PackageEntity,ConsumerService,BuyPackageEntity]),
          AuthModule,
      ],
  controllers: [PackagesController],
  providers: [PackagesService],
})
export class PackagesModule {}
