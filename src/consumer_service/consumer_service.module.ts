import { Module } from '@nestjs/common';
import { ConsumerServiceService } from './consumer_service.service';
import { ConsumerServiceController } from './consumer_service.controller';
import {AuthModule} from "../auth/auth.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConsumerService} from './entities/consumer_service.entity'
import {ConsumerCategory} from './entities/consumer_category.entity'


@Module({
  imports: [
          TypeOrmModule.forFeature([ConsumerService,ConsumerCategory]),
            AuthModule,
        ],
  
  controllers: [ConsumerServiceController],
  providers: [ConsumerServiceService],
  exports:[ConsumerServiceService]
})
export class ConsumerServiceModule {}
