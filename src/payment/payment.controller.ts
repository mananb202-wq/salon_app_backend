import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
@Get('test-order')
createTestOrder() {
  return this.paymentService.createTestOrder();
}

@Post('webhook/mock-success')
async mockWebhookSuccess(@Body() body: any) {
  return this.paymentService.handleMockSuccess(body);
}
  
}
