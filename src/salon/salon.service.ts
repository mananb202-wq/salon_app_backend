import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {Salon} from "./entities/salon.entity"
import {BranchEntity} from "./entities/branch.entity"
import {CreateSalonDto} from './dto/create-salon.dto'
import {CreateBranchDto} from './dto/create-branch.dto'
import {BranchServicesDto} from './dto/branch-services.dto'
import {BranchService} from './entities/branch-sevices.entity'
import {WorkingDays} from './entities/working-days.entity';
import {BranchSchedule} from './entities/branch-schedule.entity'
import {BranchIdDto} from './dto/branch-id.dto'
import {UpdateBranchScheduleDto} from './dto/update-branch-schedule.dto'
import {MarkAsOffOnDay} from './dto/mark-off-on-day.dto'
import {ConsumerService} from "../consumer_service/entities/consumer_service.entity"
import {UpdateSalonDto} from './dto/update-salon.dto'
import {SalonIdDto} from './dto/salon-id.dto'
import {UpdateBranchDto} from './dto/update-branch.dto'
import {OtpEntity} from './entities/otp.entity'


@Injectable()
export class SalonService {
 
     constructor(
        @InjectRepository(Salon)
        private salonRepo: Repository<Salon>,

         @InjectRepository(BranchEntity)
        private branchRepo: Repository<BranchEntity>,

        @InjectRepository(BranchService)
        private branchServiceRepo: Repository<BranchService>,

        @InjectRepository(WorkingDays)
        private workingDayRepo: Repository<WorkingDays>,

        @InjectRepository(BranchSchedule)
        private branchScheduleRepo: Repository<BranchSchedule>,
        
        @InjectRepository(ConsumerService)
        private customerServiceRepo: Repository<ConsumerService>,

        @InjectRepository(OtpEntity)
        private otpRepo: Repository<OtpEntity>,
        
    
        private jwtService: JwtService,
      ){}


  async addSalon(dto:CreateSalonDto ,req:any){
       //getting user id using jwt token 
       const userId=req.user.userId

       //checking wheather the salon already exists or not
       const salonExists= await this.salonRepo.findOne({
        where:{
            mobile_number:dto.mobileNumber
        }
       });

       //if salon already exists then send an exception
      if(salonExists){
        throw new BadRequestException("salon already registered on this number");
       }
      
       //create salon 
       const salon = await this.salonRepo.create(
        {
            name:dto.name,
            mobile_number:dto.mobileNumber,
            user:{
              id:userId
            }

        }
       )
       //saving salon in db 
       await this.salonRepo.save(salon);

       //creating branch 
       const branch= await this.branchRepo.create({
         name:dto.name,
         mobile_number:dto.mobileNumber,
         sco_number:dto.scoNumber,
         location:dto.location,
         city:dto.city,
         country:dto.country,
         email:dto.email,
         Opening_Timming:dto.openingTimming,
         Closing_Timming:dto.closingTimming,
         salon:{
          id:salon.id
         }
         })
        
         //saving branch
        await this.branchRepo.save(branch)

        //finding no of working days
        const workingDays = await this.workingDayRepo.find();
       

        //looping over no of working days
        for (const day of workingDays) {
            
          //checking wheather perticular day schedule already exists or not 
             const scheduleDayExist= await this.branchScheduleRepo.findOne({
          where:{
            id:day.id,
            branch:{
              id:branch.id
            }
          }
        })  
         //wheather schedule exists then throw an error 
         if(scheduleDayExist){
          throw new BadRequestException("sechedule already exists for this branch");
        }

       //creating the branch day wise schedule 
        const schedule =this.branchScheduleRepo.create({

             Opening_Timmings:
              dto.openingTimming,

            Closing_Timmings:
              dto.closingTimming,

             isOpen: true,

             branch: {
                id: branch.id,
              },

             workingday: {
                id: day.id,
              },
          });
          
          // saving day wise schedule 
           await this.branchScheduleRepo.save(schedule);
          }
       
       
          return{
        success:true,
        message:"salon is created",
        data:{
          "salonId":salon.id,
          "branchId":branch.id
        }
       }

     }

  async addBranch(dto:CreateBranchDto ,req : any, salonIndex: number){
   

    //checking wheather branch already exists or not 
    const existingBranch = await this.branchRepo.findOne({
      where:{
        mobile_number:dto.mobileNumber
      }
    });
     
    //is already existing branch then send the message 
    if(existingBranch){
      return{
        success:false,
        message:"branch already registered"
      }
    }

    //getting user id from the jwt token 
    const userId=req.user.userId;
   

    //running query to get salons created by the user which can be multiple 
    const SalonData= await this.salonRepo.find({
      where:{
        user:{
        id:userId
        }
      }
    });
   
   //getting the ids of the salon 
    const salonIds = SalonData.map(
     (salon) => salon.id,
    );

   //creating the branch 
    const branch= this.branchRepo.create({
         name:dto.name,
         mobile_number:dto.mobileNumber,
         sco_number:dto.scoNumber,
         location:dto.location,
         city:dto.city,
         country:dto.country,
         email:dto.email,
         Opening_Timming:dto.openingTimming,
         Closing_Timming:dto.closingTimming,
         salon:{
          id:salonIds[salonIndex] // making salon id as foriegn key in database using salon index which is in the params  
         }
         })
      

        // saving branch   
        await this.branchRepo.save(branch)

       //getting branch details using a query findone from database 
        const Branch= await this.branchRepo.findOne({
          where:{
            salon:{
              id:salonIds[salonIndex]
            }
          }
        });

        //getting services of a perticular salon branch from db  
        const getServices= await this.branchServiceRepo.find({
          where:{
            branch:{
              id:Branch?.id
            }
          }
        })
      
        //we are loop in over the services data which got from database
        for(const services of getServices){
         
          //coping the servies 
        const addBranchService= await this.branchServiceRepo.create({
        branch:{
       id:branch.id
        },
        service:{
          id:services.id
        }
      });
      //saving the services
      await this.branchServiceRepo.save(addBranchService)

        }

       //the below code is to create the schedule of a branch day wise

       
       //getting working days data mainly to know how many working days are there
        const workingDays = await this.workingDayRepo.find();
        

        //looping over the working days
        for (const day of workingDays) {
        
          //checking wheather perticular day schedule already exists or not 
        const scheduleExist= await this.branchScheduleRepo.findOne({
          where:{
            id:day.id,
            branch:{
              id:branch.id
            }
          }
        })  
       //if schedule exists then there will a exception 
        if(scheduleExist){
          throw new BadRequestException("sechedule already exists for this branch");
        }
        

        //if schedule does not already exists the we will create a new schedule in database
        const schedule =this.branchScheduleRepo.create({

             Opening_Timmings:dto.openingTimming,

            Closing_Timmings:dto.closingTimming,

             isOpen: true,

             branch: {
                id: branch.id,
              },

             workingday: {
                id: day.id,
              },
          });
          // saving schedule in database 
           await this.branchScheduleRepo.save(schedule);
          }

         return {
          success:true,
          message:"branch is created",
          data:branch.id
         }

     }


  async addBranchServices(dto:BranchServicesDto[] ,req : any ,salonIndex: number, branchIndex: number){
     
    const userId=req.user.userId;

    const SalonData= await this.salonRepo.find({
      where:{
        user:{
        id:userId
        }
      }
    });
   
    if(!SalonData){
      throw new BadRequestException("salon not found")
    }
    const salonIds = SalonData.map(
     (salon) => salon.id,
    );

    const selectedSalonId=salonIds[salonIndex];

    const branchData= await this.branchRepo.find({
      where:{
        salon:{
        id:selectedSalonId
        }
      }
    });

      if(!branchData){
      throw new BadRequestException("branches not found")
    }

     const branchIds = branchData.map(
     (salon) => salon.id,
    );

    const selectedBranchId= branchIds[branchIndex];

    for (const item of dto){

      const getService= await this.customerServiceRepo.find({
        where:{
          category:{
            id:item.categoryId 
          }

        }
      })

      if(getService.length === 0){
        throw new NotFoundException("services not found")
      }
      
      for (const service of getService){

        const serviceExists= await this.branchServiceRepo.findOne({
        where:{
          service:{
            id:service.id
          },
          branch:{
            id:selectedBranchId
          }
        }
      });


      if(serviceExists){
        continue;
      }
       
      const addBranchService= await this.branchServiceRepo.create({
        branch:{
       id:selectedBranchId
        },
        service:{
          id:service.id
        }
      });

      await this.branchServiceRepo.save(addBranchService)

      }
     
    
     }

     return{
      success:true,
      message:"services are added to the branch"
     }

     }

    async deleteBranch(req : any,salonIndex: number,branchIndex: number){

    const userId=req.user.userId;

    const SalonData= await this.salonRepo.find({
      where:{
        user:{
        id:userId
        }
      }
    });
   
    if(SalonData.length=== 0){
      throw new BadRequestException("salon not found")
    }
    const salonIds = SalonData.map(
     (salon) => salon.id,
    );
    
    const selectedSalonId=salonIds[salonIndex];
     
    const branchData= await this.branchRepo.find({
      where:{
        salon:{
        id:selectedSalonId
        }
      }
    });

      if(branchData.length === 0){
      throw new BadRequestException("branches not found")
    }

     const branchIds = branchData.map(
     (salon) => salon.id,
    );

      const selectedBranchId= branchIds[branchIndex];
 
 
      await this.branchRepo.delete(selectedBranchId)

    if(branchIds.length==1){
     await this.salonRepo.delete(selectedSalonId)
    }
      
     return  {
      sucess:true,
      message:'the branch is deleted succesfully'

     }
     }


     async deleteSalon(req : any , salonIndex: number){
      const userId=req.user.userId;

    const SalonData= await this.salonRepo.find({
      where:{
        user:{
        id:userId
        }
      }
    });
   
    if(SalonData.length=== 0){
      throw new BadRequestException("salon not found")
    }
    const salonIds = SalonData.map(
     (salon) => salon.id,
    );
    
    const selectedSalonId=salonIds[salonIndex];
  await this.salonRepo.delete(selectedSalonId)

  return {
    success:true,
    message:"salon deleted"
  }

  }


   
  async seedWorkingDays() {
    
  const weekDays = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
  
    for (const day of weekDays ) {

      const existingWorkingDay =
        await this.workingDayRepo.findOne({
          where: {
            name: day,
          },
        });

      if (!existingWorkingDay) {

        const workingDay =
          this.workingDayRepo.create({
            name: day,
          
          });

        await this.workingDayRepo.save(workingDay);
      }

      


    }
  }

  async seedOtp(){

    const otp='123456';

    const createOtp=await this.otpRepo.create({
      Otp:otp 

    });

    await this.otpRepo.save(createOtp);
  }


  async getBranchSchedule(req : any,salonIndex: number,branchIndex: number){

    const userId=req.user.userId;

    const SalonData= await this.salonRepo.find({
      where:{
        user:{
        id:userId
        }
      }
    });
   
    if(SalonData.length=== 0){
      throw new BadRequestException("salon not found")
    }
    const salonIds = SalonData.map(
     (salon) => salon.id,
    );
    
    const selectedSalonId=salonIds[salonIndex];
     
    const branchData= await this.branchRepo.find({
      where:{
        salon:{
        id:selectedSalonId
        }
      }
    });

      if(branchData.length === 0){
      throw new BadRequestException("branches not found")
    }

     const branchIds = branchData.map(
     (salon) => salon.id,
    );

      const selectedBranchId= branchIds[branchIndex];

      const branchSchedule= await this.branchScheduleRepo.find({
        where:{
          branch:{
            id:selectedBranchId
          }
        },
        relations: {
      branch: true,
       workingday: true,
      },
      });

      if(branchSchedule.length === 0){
        throw new BadRequestException("branch schedule does not exists")
      }

      return {
        success:true,
        message:"banch schedule is send ",
        data:branchSchedule
      }
     }

     async getBranchScheduleUsingId(dto:BranchIdDto){
      

       const branchSchedule= await this.branchScheduleRepo.find({
        where:{
          branch:{
            id:dto.branchId
          }
        },
        relations: {
       branch: true,
       workingday: true,
      },
      });

        if(branchSchedule.length === 0){
        throw new BadRequestException("branch schedule does not exists")
      }

      return {
        success:true,
        message:"banch schedule is send ",
        data:branchSchedule
      }

     }


     async updateBranchSchedule(req : any, dto :UpdateBranchScheduleDto , salonIndex: number,branchIndex: number){

     const userId=req.user.userId;

    const SalonData= await this.salonRepo.find({
      where:{
        user:{
        id:userId
        }
      }
    });
   
    if(SalonData.length=== 0){
      throw new BadRequestException("salon not found")
    }
    const salonIds = SalonData.map(
     (salon) => salon.id,
    );
    
    const selectedSalonId=salonIds[salonIndex];
     
    const branchData= await this.branchRepo.find({
      where:{
        salon:{
        id:selectedSalonId
        }
      }
    });

      if(branchData.length === 0){
      throw new BadRequestException("branches not found")
    }

     const branchIds = branchData.map(
     (salon) => salon.id,
    );

      const selectedBranchId= branchIds[branchIndex];

      const getDayScheduleBranch= await this.branchScheduleRepo.findOne({
        where:{
          branch:{
            id:selectedBranchId
          },
          workingday:{
            id:dto.selectedDayID
          }

        }
      });

       if(!getDayScheduleBranch){
  throw new BadRequestException(
    "Branch schedule does not exist"
  )
}

      Object.assign(
    getDayScheduleBranch,
    {
      Opening_Timmings:dto.openingTimming,
      Closing_Timmings:dto.closeingTimming
    } );

    await this.branchScheduleRepo.save(getDayScheduleBranch,);

    return {
      success:true,
      message:"timmings are updated",
      data:getDayScheduleBranch
    }

     }


     async updateBranchScheduleUsingId(dto :UpdateBranchScheduleDto){
      

      const getDayScheduleBranch= await this.branchScheduleRepo.findOne({
        where:{
          branch:{
            id:dto.branchId
          },
          workingday:{
            id:dto.selectedDayID
          }

        }
      });

       if(!getDayScheduleBranch){
  throw new BadRequestException(
    "Branch schedule does not exist"
  )
}

      Object.assign(
    getDayScheduleBranch,
    {
      Opening_Timmings:dto.openingTimming,
      Closing_Timmings:dto.closeingTimming
    } );

    await this.branchScheduleRepo.save(getDayScheduleBranch,);

    return {
      success:true,
      message:"timmings are updated",
      data:getDayScheduleBranch
    }
     }


     async markAsOffandOnWorkingDay(dto :MarkAsOffOnDay){
       const getDayScheduleBranch= await this.branchScheduleRepo.findOne({
        where:{
          branch:{
            id:dto.branchId
          },
          workingday:{
            id:dto.selectedDayID
          }

        }
      });

      if(!getDayScheduleBranch){
        throw new BadRequestException("Branch schedule does not exist")
      }

      if(getDayScheduleBranch.isOpen===true){
        Object.assign(
    getDayScheduleBranch,
    {
      isOpen:false
    } );
      }else{

    Object.assign(
    getDayScheduleBranch,
    {
      isOpen:true
    } 
    );

      }

      await this.branchScheduleRepo.save(getDayScheduleBranch,);

      return{
        success:true,
        message:"isOpen is updated",
        data:getDayScheduleBranch.isOpen
      }

     }


async updateSalon(dto:UpdateSalonDto,req : any){
     
         const userId=req.user.userId;

         const Salon= await this.salonRepo.findOne({
          where:{
          id:dto.salonId,
          user:{
            id:userId
          }
          }
         });


      if(!Salon){
        throw new NotFoundException("Salon not found")
      }

       if (dto.name!== undefined) Salon.name = dto.name;
       if (dto.mobileNumber!== undefined) Salon.mobile_number = dto.mobileNumber;

       await this.salonRepo.save(Salon);

        return{
         success:true,
         message:"salon is updated",
         data:Salon
        }
     }

     

     async getSalonDetails(req : any,dto:SalonIdDto){


       const userId=req.user.userId;

         const Salon= await this.salonRepo.findOne({
          where:{
          id:dto.salonId,
          user:{
            id:userId
          }
          }
         });

        if(!Salon){
        throw new NotFoundException("Salon not found")
        }

        return{
          success:true,
          message:"salon details send",
          data:Salon
        }

     }

     async updateBranch(dto:UpdateBranchDto){

         const branch= await this.branchRepo.findOne({
          where:{
          id:dto.branchId,
          }
         });

        if(!branch){
        throw new NotFoundException("branch not found")
        }

       if (dto.name!== undefined) branch.name = dto.name;
       if (dto.scoNumber!== undefined) branch.sco_number = dto.scoNumber;
        if (dto.location!== undefined) branch.location = dto.location;
        if (dto.city!== undefined) branch.city = dto.city;
        if (dto.country!== undefined) branch.country = dto.country;
        if (dto.mobileNumber!== undefined) branch.mobile_number = dto.mobileNumber;
        if(dto.closingTimming!== undefined) branch.Closing_Timming=dto.closingTimming;
        if(dto.openingTimming!==undefined) branch.Opening_Timming=dto.openingTimming;


          await this.salonRepo.save(branch);

        return{
         success:true,
         message:"branch is updated",
         data:branch
        }

     }

     async getBranchdetails(dto:BranchIdDto){

        const branch= await this.branchRepo.findOne({
          where:{
          id:dto.branchId,
          }
         });

         if(!branch){
        throw new NotFoundException("branch not found")
        }

        return {
          success:true,
          message:"branch details are send",
          data:branch
        }

     }




}
