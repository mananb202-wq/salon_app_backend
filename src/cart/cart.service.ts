import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import {Repository} from "typeorm";
import { CartItemEntity, CartItemType } from './entities/cart-items.entity';

@Injectable()
export class CartService {

     constructor(
        @InjectRepository(CartEntity)
        private cartRepo :Repository<CartEntity>,

        @InjectRepository(CartItemEntity)
        private cartItem :Repository<CartItemEntity>
     ){}

     

    async addItemToCart(customerId:number, dto:CreateCartItemDto){
        
        let cartID;
        const isActiveCartExists= await this.cartRepo.findOne({
            where:{
                customer:{
                    id:customerId
                },
                isActive:true
            }
        });

        cartID=isActiveCartExists?.id

        if(!isActiveCartExists){

            const createCart= await this.cartRepo.create({
                customer:{
                    id:customerId
                },
                isActive:true
            });

            try{
                await this.cartRepo.save(createCart);
            }catch(error){
            throw new BadRequestException(
                'failed to create cart'
            )
            }

            cartID=createCart.id
        }

    if(dto.itemType == CartItemType.SERVICE ){
       
    const existingItem = await this.cartItem.findOne({
    where: {
      cart: { 
        id: cartID 
      },
      service: { 
        id: dto.serviceId 
      },
      branch:{
        id:dto.branchId
      }
    },
    });

    if(existingItem){
      throw new BadRequestException("Item already in cart");
    }

    const addCartItem = await this.cartItem.create({
        cart: { id: cartID },
        service: { id: dto.serviceId },
        branch:{id:dto.branchId}
    })

      this.cartItem.save(addCartItem);
    }


    if(dto.itemType == CartItemType.PACKAGE ){
      const existingItem = await this.cartItem.findOne({
    where: {
      cart: { 
        id: cartID
       },
      package: { 
        id: dto.packageId 
      },
      branch:{
        id:dto.branchId
      }
    },
    });

      if(existingItem){
      throw new BadRequestException("Item already in cart");
    }

      const addCartItem = await this.cartItem.create({
        cart: { id: cartID },
        package: { id: dto.packageId },
        branch:{id:dto.branchId}
    })

      this.cartItem.save(addCartItem);

    }

    if(dto.itemType == CartItemType.DEAL ){
    const existingItem = await this.cartItem.findOne({
    where: {
    cart: { id: cartID },
    deal: { id: dto.dealId },
    branch:{id:dto.branchId}
    },
    });

    if(existingItem){
      throw new BadRequestException("Item already in cart");
    }

    const addCartItem = await this.cartItem.create({
        cart: { id: cartID },
        deal: { id: dto.dealId },
        branch:{id:dto.branchId}
    })

     this.cartItem.save(addCartItem);

    }

    return {
        sucess:true,
        message:'Item added to cart',
    } 
    }


    async getCartItems(cartId:number){

        const getCartItems= await this.cartItem.find({
            where:{
                cart:{
                    id:cartId
                }
            },

            relations:{
                service:true,
                deal:true,
                package:true,
                branch:true
            }

        });


        if(getCartItems.length === 0){
            throw new BadRequestException("cart Items Not found")
        }

        return{
            success:true,
            message:"get cart items",
            data:getCartItems
        }
    }

    }

