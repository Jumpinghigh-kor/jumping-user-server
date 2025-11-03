import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DeliveryTrackerController } from './delivery-tracker.controller';
import { DeliveryTrackerService } from './delivery-tracker.service';

@Module({
  imports: [HttpModule],
  controllers: [DeliveryTrackerController],
  providers: [DeliveryTrackerService],
})
export class DeliveryTrackerModule {}


