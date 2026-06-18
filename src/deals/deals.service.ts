import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {DealTypeEntity} from './entities/deal-type.entity'
import {CreateDealDto} from './dto/create-deal.dto'
import {DealsEntity} from './entities/create-deals.entity'
import {DeleteDealDto} from './dto/delete-deal.dto'
import {BranchIdDto} from '../salon/dto/branch-id.dto'
import {BuyDealEntity} from './entities/buy-deal.entity'
import { CustomerEntity } from '../customer/entities/create-customer.entity';
import { ConsumerService } from '../consumer_service/entities/consumer_service.entity';
 


@Injectable()
export class DealsService {

     constructor(
     @InjectRepository(DealTypeEntity)
      private dealTypeRepo: Repository<DealTypeEntity>,
     
      @InjectRepository(DealsEntity)
      private dealsRepo: Repository<DealsEntity>,

      
      @InjectRepository(BuyDealEntity)
      private buyDealsRepo: Repository<BuyDealEntity>,

      @InjectRepository(CustomerEntity)
      private customerRepo: Repository<CustomerEntity>,


      @InjectRepository(ConsumerService)
       private servicesRepo: Repository<ConsumerService>,

     ){}

async createDeal(dto: CreateDealDto) {

  let totalPrice=0
  let finalPrice=0
    for(const servicesID of dto.serviceIds){
      
        const serviceData= await this.servicesRepo.findOne({
        where:{
            id:servicesID
        }
      });
      totalPrice+=Number(serviceData?.price!);
     }


     if (dto.dealTypeId === 1) {

    if (dto.discountAmount == null) {
      throw new BadRequestException(
        'Discount amount is required',
      );
    }

    finalPrice =
      totalPrice - dto.discountAmount;

    if (finalPrice < 0) {
      finalPrice = 0;
    }
  }


  else if (dto.dealTypeId === 2) {

    if (dto.percentageDiscount == null) {
      throw new BadRequestException(
        'Percentage is required',
      );
    }

    let discount =
    (totalPrice * dto.percentageDiscount) / 100;

    if (
      dto.maxDiscountAmount != null &&
      discount > dto.maxDiscountAmount
    ) {
      discount = dto.maxDiscountAmount;
    }

      finalPrice =
      totalPrice - discount;
  }

   else {
    throw new BadRequestException(
      'Invalid deal type',
    );
  }
    
  const createDeal=await this.dealsRepo.create({
      name: dto.name,
      branch: {
        id: dto.branchId,
      },
      services: dto.serviceIds.map(id => ({
        id,
      })),
      totalPrice:totalPrice,
      finalPrice,
      percentageDiscount: dto.percentageDiscount,
      maxDiscountAmount:dto.maxDiscountAmount,
      isActive: dto.isActive,
      discountAmount:dto.discountAmount,
      dealType: {
        id: dto.dealTypeId,
      },
      startDate:dto.startDate,
      endDate:dto.endDate,
      })

const savedDeal=await this.dealsRepo.save(createDeal);

      const deal = await this.dealsRepo.findOne({
      where: { id: savedDeal.id },
      relations:{
        branch:true,
        services:true,
        dealType:true
      },
     });

    return {
      success:true,
      message:"Deal created",
      data:deal
      }
     
    }



    async deleteDeal(index:number,dto:DeleteDealDto){
      
      const deals= await this.dealsRepo.find({
        where:{
          branch:{
            id:dto.branchId
          }
        }
      });

      if(!deals){
        throw new NotFoundException("deals not found");
      }
      console.log(deals)

      await this.dealsRepo.delete(deals[index].id);

      return {
        success:true, 
        message:"deal is deleted"
      }

    }



    async seedDealType(){
    
        const dealTypes=["FLAT AMOUNT","PERCENTAGE"];

        for (const deal of dealTypes){
           
        const existingDealName = await this.dealTypeRepo.findOne({
          where: {
            name: deal,
          },
        });
        
        if(!existingDealName){
        
            const dealname= this.dealTypeRepo.create({
                name:deal,
            });

            await this.dealTypeRepo.save(dealname)
        }
       
        }

    }


    async getDeals(dto:BranchIdDto){

      const deals= await this.dealsRepo.find({
        where:{
          branch:{
            id:dto.branchId
          }
        },
        relations:{
          branch:true,
          services:true,
          dealType:true
        }
      });

      if(deals.length===0){
        throw new NotFoundException("Deals not found");
      }

      return{
        success:true,
        message:"deals are send",
        data:deals
      }

    }

    async buyDeal(dealId:number,customerId:number){
     
      const dealExists= await this.dealsRepo.findOne({
       where : {
         id:dealId,
       },
      });

      if(!dealExists){
         throw new BadRequestException(
        'deal does not exists',
      );
    }

    const customerExists= await this.customerRepo.findOne({
      where:{
        id:customerId,
      },
    });


    if(!customerExists){
      throw new BadRequestException(
        'customer does not exists'
      );
    };


    const createBuyDeal= await this.buyDealsRepo.create({
      deal:{
      id:dealId,
      },
      customer:{
        id:customerId
      },  
      expiresAt:dealExists.endDate,
    })
    try{
    await this.buyDealsRepo.save(createBuyDeal)
    }catch(error){
      throw new BadRequestException(
        'Failed to save deal in the database'
      )
    }

     

    }




    

}
