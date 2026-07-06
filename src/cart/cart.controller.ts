import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCartItemDto } from './dto/create-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post("addItem/:customerId")
  addItemToCart(@Param('customerId',ParseIntPipe) customerId:number , @Body() dto:CreateCartItemDto ){
  return this.cartService.addItemToCart(customerId,dto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("/:cartId")  
  getCartItems(@Param('cartId', ParseIntPipe) cartId:number){
  return this.cartService.getCartItems(cartId)
  }
}
