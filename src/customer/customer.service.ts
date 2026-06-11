import { Injectable,BadRequestException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CustomerEntity} from "./entities/create-customer.entity"
import { CreateCustomerDto } from './dto/create-customer.dto';


@Injectable()
export class CustomerService {
  
     constructor(
        @InjectRepository(CustomerEntity)
        private customerRepo: Repository<CustomerEntity>,
      ){}

    async addCustomer(dto:CreateCustomerDto ){

        const customerExists= await this.customerRepo.findOne({
            where:{
                 mobileNumber:dto.mobileNumber
            }
        });

        if(customerExists){
            throw new BadRequestException("user already exists");
        }

      const customer= await this.customerRepo.create({

        name:dto.name,
        mobileNumber:dto.mobileNumber,
        email:dto.email,
        branch:{
            id:dto.branchId
        }
      });

      this.customerRepo.save(customer)

      return{
        success:true,
        message:"customer created",
        data:customer
      }

    }
}
