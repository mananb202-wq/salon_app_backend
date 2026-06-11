import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {CreateCustomerDto} from './dto/create-customer.dto'


@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}


   @UseGuards(AuthGuard('jwt'))
    @Post("/add")
    addCustomer(@Body() dto:CreateCustomerDto ){
    return this.customerService.addCustomer(dto)
    }
  

}
