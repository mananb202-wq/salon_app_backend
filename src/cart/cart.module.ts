import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module"
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-items.entity';


@Module({
    imports: [
          TypeOrmModule.forFeature([CartItemEntity,CartEntity]),
            AuthModule,
        ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
