import {
  Module,
  OnModuleInit,
} from '@nestjs/common';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SalonModule } from './salon/salon.module';
import { TeamMemberModule } from './team_member/team_member.module';
import {RolesModule} from './roles/roles.module';
import {ConsumerServiceModule} from './consumer_service/consumer_service.module'
import {RolesService} from './roles/roles.service'
import {ConsumerServiceService} from './consumer_service/consumer_service.service'
import {SalonService} from './salon/salon.service';
import { DealsModule } from './deals/deals.module';
import {DealsService} from './deals/deals.service';
import { PackagesModule } from './packages/packages.module';
import { BookingModule } from './booking/booking.module';
import { CustomerModule } from './customer/customer.module';
import { CartModule } from './cart/cart.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentModule } from './payment/payment.module';
import { AnalyticsModule } from './analytics/analytics.module';




@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    
    }),
        ScheduleModule.forRoot(),
  
      TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        host: config.get<string>('DB_HOST'),

        port: config.get<number>('DB_PORT'),

        username: config.get<string>('DB_USERNAME'),

        password: config.get<string>('DB_PASSWORD'),

        database: config.get<string>('DB_NAME'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),
    UserModule,
    AuthModule,
    SalonModule,
    TeamMemberModule,
    RolesModule,
  ConsumerServiceModule,
  DealsModule,
  PackagesModule,
  BookingModule,
  CustomerModule,
  CartModule,
  PaymentModule,
  AnalyticsModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule
  implements OnModuleInit {

  constructor(
    private readonly rolesService:
      RolesService,
    
      private readonly ConsumerServiceService:
      ConsumerServiceService,

      private readonly SalonServiceService:
      SalonService,

      private readonly DealService:
      DealsService,


  ) {}

  async onModuleInit(): Promise<void> {

   await this.rolesService.seedRoles();

   await this.ConsumerServiceService.seedConsumerCategories()
 
   await this.ConsumerServiceService.seedConsumerService();

    await this.SalonServiceService.seedWorkingDays();

    await this.SalonServiceService.seedOtp()

    await this.DealService.seedDealType()

  }
  }
