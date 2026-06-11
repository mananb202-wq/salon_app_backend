import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ConsumerService} from "./entities/consumer_service.entity";
import {ConsumerCategory} from './entities/consumer_category.entity'


@Injectable()
export class ConsumerServiceService {
  constructor(
        @InjectRepository(ConsumerService)
        private consumerServicesRepo: Repository<ConsumerService>,

         @InjectRepository(ConsumerCategory)
        private consumerCategoryRepo: Repository<ConsumerCategory>,
  ){}


  async seedConsumerService() {
    
  const services = [
  {
    categoryId:1,
    name: "hair cut",
    duration: "00:30:00",
    price:200.00
  },

  {
    categoryId:1,
    name: "beard trim",
    duration: "00:15:00",
    price:500.00
  },

  {
    categoryId:2,
    name: "facial",
    duration: "01:00:00",
    price:900.00
  },
];
      

    for (const serviceData of services ) {

      const existingRole =
        await this.consumerServicesRepo.findOne({
          where: {
            name: serviceData.name,
          },
        });

      if (!existingRole) {

        const role =
          this.consumerServicesRepo.create({
            category:{
              id:serviceData.categoryId
            },
            name: serviceData.name, 
            duration:serviceData.duration,
            price:serviceData.price
          }); 

        await this.consumerServicesRepo.save(role);
      }
    }
  }


  async seedConsumerCategories() { 
    
  const CategoriesData = ["hair","Facial"];
      

    for (const category of CategoriesData ) {

      const existingCategory =
        await this.consumerCategoryRepo.findOne({
          where: {
            name: category,
          },
        });

      if (!existingCategory) {

        const categoryCreated =
          this.consumerCategoryRepo.create({
            name: category
          });

        await this.consumerCategoryRepo.save(categoryCreated);
      }
    }
  }
}
