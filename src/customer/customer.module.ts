import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module"
import {CustomerEntity} from './entities/create-customer.entity'

@Module({
    imports: [
          TypeOrmModule.forFeature([CustomerEntity]),
            AuthModule,
        ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
