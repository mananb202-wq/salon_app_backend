import { Injectable,BadRequestException, NotFoundException } from '@nestjs/common';
import {CreatePackage} from './dto/create-package.dto'
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {DurationType, PackageEntity} from './entities/package.entity'
import {ConsumerService} from '../consumer_service/entities/consumer_service.entity'
import { BranchIdDto } from '../salon/dto/branch-id.dto';
import {UpdatePackageDto} from './dto/update-package.dto'
import { BuyPackageEntity } from './entities/buy-package.entity';
import { dot } from 'node:test/reporters';
import { PaymentEntity, PaymentStatus } from '../payment/entities/payment.entity';
import { RazorpayService } from '../payment/razorpay.service';

@Injectable()
export class PackagesService {


    constructor(
      @InjectRepository(PackageEntity)
       private packageRepo: Repository<PackageEntity>,

      @InjectRepository(ConsumerService)
       private servicesRepo: Repository<ConsumerService>,
       
      @InjectRepository(BuyPackageEntity)
       private buyPackageRepo: Repository<BuyPackageEntity>,

      @InjectRepository(PaymentEntity)
      private paymentRepo: Repository<PaymentEntity>,

      private readonly razorpayService: RazorpayService,
        
        
    ){}

async addPackage(dto:CreatePackage, req:any){

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


     if (dto.dealType === 1) {

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


  else if (dto.dealType === 2) {

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

    const packageData =
    await this.packageRepo.create({
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
      duration:dto.duration,
      durationType:dto.durationType,
      isActive: dto.isActive,
      discountAmount:dto.discountAmount,
      dealType: {
        id: dto.dealType,
      },
    });

  await this.packageRepo.save(packageData);

  return {
    success:true,
    message:"package is created",
    data:packageData
  }
}

async getPackage(dto:BranchIdDto){

  const packages= await this.packageRepo.find({
    where:{
      branch:{
        id:dto.branchId
      }
    },
    relations:{
      branch:true,
      dealType:true,
      services:true
    }
  });

  if(packages.length === 0){
    throw new NotFoundException("packages not found");
  }

  return {
    success:true,
    message:"packages send",
    data:packages
  }

}

async deletePackage(packageId:number){

  const result = await this.packageRepo.delete(packageId);

  if (result.affected === 0) {
    throw new NotFoundException('Package not found');
  }

  return {
    success: true,
    message: 'Package deleted',
  };

}

async updatePackage(
  packageId: number,
  dto: UpdatePackageDto,
) {
  const getPackage = await this.packageRepo.findOne({
    where: {
      id: packageId,
    },
    relations: {
      dealType: true,
      services: true,
    },
  });

  if (!getPackage) {
    throw new NotFoundException(
      'Package not found',
    );
  }


  if (dto.name !== undefined) {
    getPackage.name = dto.name;
  }

  if (dto.isActive !== undefined) {
    getPackage.isActive = dto.isActive;
  }



 
  if (dto.dealType !== undefined) {
    getPackage.dealType = {
      id: dto.dealType,
    } as any;
  }

  const dealTypeId =
    dto.dealType ??
    getPackage.dealType.id;


  if (dto.serviceIds !== undefined) {
    let totalPrice = 0;
    const services: ConsumerService[] = [];

    for (const serviceId of dto.serviceIds) {
      const service =
        await this.servicesRepo.findOne({
          where: {
            id: serviceId,
          },
        });

      if (!service) {
        throw new BadRequestException(
          `Service ${serviceId} not found`,
        );
      }

      totalPrice += Number(
        service.price,
      );

      services.push(service);
    }

    getPackage.services = services;
    getPackage.totalPrice = totalPrice;
  }


  if (dealTypeId === 1) {
    if (dto.discountAmount !== undefined) {
      getPackage.discountAmount =
        dto.discountAmount;
    }

    getPackage.percentageDiscount =
      null;

    getPackage.maxDiscountAmount =
      null;

    const discountAmount =
      getPackage.discountAmount ?? 0;

    if (
      discountAmount >
      getPackage.totalPrice
    ) {
      throw new BadRequestException(
        'Discount amount is greater than total price',
      );
    }

    getPackage.finalPrice =
      getPackage.totalPrice -
      discountAmount;
  }

 
  else if (dealTypeId === 2) {
    getPackage.discountAmount = null;

    if (
      dto.percentageDiscount !==
      undefined
    ) {
      getPackage.percentageDiscount =
        dto.percentageDiscount;
    }

    if (
      dto.maxDiscountAmount !==
      undefined
    ) {
      getPackage.maxDiscountAmount =
        dto.maxDiscountAmount;
    }

    if (
      getPackage.percentageDiscount ==
      null
    ) {
      throw new BadRequestException(
        'Percentage discount is required',
      );
    }

    let discount =
      (getPackage.totalPrice *
        getPackage.percentageDiscount) /
      100;

    if (
      getPackage.maxDiscountAmount !=
        null &&
      discount >
        getPackage.maxDiscountAmount
    ) {
      discount =
        getPackage.maxDiscountAmount;
    }

    getPackage.finalPrice =
      getPackage.totalPrice -
      discount;
  }

  await this.packageRepo.save(
    getPackage,
  );

  return {
    success: true,
    message: 'Package updated',
    data: getPackage,
  };
}





async buyPackage(packageId:number,customerId){
 
 
 const packageData= await this.packageRepo.findOne({
  where:{
    id:packageId
  },
    relations: {
    services: true,
  },
 });

 if(!packageData){
      throw new BadRequestException(
        'package not found',
      );
 }
const expiresAt = new Date();

switch (packageData.durationType) {
  case DurationType.DAYS:
    expiresAt.setDate(
      expiresAt.getDate() + packageData.duration,
    );
    break;

  case DurationType.MONTHS:
    expiresAt.setMonth(
      expiresAt.getMonth() + packageData.duration,
    );
    break;

  case DurationType.YEARS:
    expiresAt.setFullYear(
      expiresAt.getFullYear() + packageData.duration,
    );
    break;
}
const serviceIds= packageData.services.map(service => service.id);
let totalAmount=0
 for(let i=0;i<serviceIds.length;i++){
  const getAmount = await this.servicesRepo.findOne({
    where:{
      id:serviceIds[i]
    }
  });
  totalAmount+=Number(getAmount?.price)
 }

 
const order = await this.razorpayService.createOrder(
    totalAmount,
    `reservation_${packageId}`,
  );

  const payment = this.paymentRepo.create({
    razorpayOrderId: order.id,
    amount: totalAmount,
    status: PaymentStatus.PENDING,
    package:{
      id:packageId
    }
    
  });

  await this.paymentRepo.save(payment);

  return{
    message:"order created",
    data:{
    orderId:order,
    packageId,
    customerId,
    expiresAt

    }
  }

}

  
}
