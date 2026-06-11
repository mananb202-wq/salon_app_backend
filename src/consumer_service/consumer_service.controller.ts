import { Controller, } from '@nestjs/common';
import { ConsumerServiceService } from './consumer_service.service';


@Controller('consumer-service') 
export class ConsumerServiceController {
  constructor(private readonly consumerServiceService: ConsumerServiceService) {}


}
