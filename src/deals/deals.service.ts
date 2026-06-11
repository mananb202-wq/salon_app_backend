import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {DealTypeEntity} from './entities/deal-type.entity'
import {CreateDealDto} from './dto/create-deal.dto'
import {DealsEntity} from './entities/create-deals.entity'
import {DeleteDealDto} from './dto/delete-deal.dto'
import {UpdateDealDto} from './dto/update-deal.dto'
import {BranchIdDto} from '../salon/dto/branch-id.dto'
import { truncate } from 'fs';
 


@Injectable()
export class DealsService {

     constructor(
     @InjectRepository(DealTypeEntity)
      private dealTypeRepo: Repository<DealTypeEntity>,
     
      @InjectRepository(DealsEntity)
      private dealsRepo: Repository<DealsEntity>,
     ){}

    async createDeal(dto: CreateDealDto) {

      
      let finalPrice=0;
      if(dto.dealTypeId==2){
        let discount=(dto.originalPrice*dto.percentage!)/100
        finalPrice=dto.originalPrice-discount

        if(discount > dto.maxDiscountAmount!){
          discount=dto.maxDiscountAmount!
          finalPrice=dto.originalPrice-discount
        }
      }else{
        finalPrice=dto.value!
      }
    
        const createDeal=await this.dealsRepo.create({
              name:dto.name,
              branch:{
                id:dto.branchId
              },
              services:{
                id:dto.serviceId
              },
              deal_type:{
                id:dto.dealTypeId
              },
              originalPrice:dto.originalPrice,
              percentage:dto.percentage,
              value:finalPrice,
              isActive:dto.isActive,
              startDate:dto.startDate,
              endDate:dto.endDate,
              maxDiscountAmount:dto.maxDiscountAmount

          })

          await this.dealsRepo.save(createDeal);

          return {
            success:true,
            message:"Deal created",
            data:createDeal
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

  async updateDeal(index: number, dto: UpdateDealDto) {

  const deals = await this.dealsRepo.find({
    where: {
      branch: {
        id: dto.branchId,
      },
    },
    relations: {
      deal_type: true,
    },
  });

  const deal = deals[index];

  if (!deal) {
    throw new NotFoundException('Deal not found');
  }

  const dealTypeId =
    dto.dealTypeId ?? deal.deal_type.id;

  // Update basic fields FIRST (safe assignment)
  if (dto.name !== undefined) deal.name = dto.name;
  if (dto.originalPrice !== undefined) deal.originalPrice = dto.originalPrice;
  if (dto.isActive !== undefined) deal.isActive = dto.isActive;
  if (dto.startDate !== undefined) deal.startDate = dto.startDate;
  if (dto.endDate !== undefined) deal.endDate = dto.endDate;
  if (dto.branchId !== undefined) {
    deal.branch = { id: dto.branchId } as any;
  }

 
  if (dto.dealTypeId !== undefined) {
    deal.deal_type = { id: dto.dealTypeId } as any;
  }

 
  if (dealTypeId === 1) {

    if (dto.value == null && deal.value == null) {
      throw new BadRequestException(
        'Flat discount value required',
      );
    }

    deal.percentage = null as any;
    deal.maxDiscountAmount = null as any;

    const discount = dto.value ?? deal.value;

    deal.value =
      deal.originalPrice - discount!;
  }

  if (dealTypeId === 2) {

    if (
      dto.percentage == null &&
      deal.percentage == null
    ) {
      throw new BadRequestException(
        'Percentage is required',
      );
    }

    if (dto.percentage !== undefined) {
      deal.percentage = dto.percentage;
    }

    if (dto.maxDiscountAmount !== undefined) {
      deal.maxDiscountAmount =
        dto.maxDiscountAmount;
    }

    let discount =
      (deal.originalPrice * deal.percentage!) / 100;

    if (
      deal.maxDiscountAmount &&
      discount > deal.maxDiscountAmount
    ) {
      discount = deal.maxDiscountAmount;
    }

    deal.value =
      deal.originalPrice - discount;
  }

  await this.dealsRepo.save(deal);

  return {
    success: true,
    message: 'Deal updated',
    data: deal,
  };
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
          deal_type:true 
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




    

}
