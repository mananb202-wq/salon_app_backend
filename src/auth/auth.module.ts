import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "../user/entities/user.entity"
import {OtpEntity} from '../salon/entities/otp.entity'
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [

    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),

           TypeOrmModule.forFeature([User,OtpEntity]),
    
  ],

  controllers: [AuthController],

  providers: [AuthService,JwtStrategy],
   exports: [
    JwtModule, 
  ],

})
export class AuthModule {}