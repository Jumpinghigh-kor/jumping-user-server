import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { DeliveryTrackerService } from 'src/delivery-tracker/delivery-tracker.service';

@Controller('delivery-tracker')
export class DeliveryTrackerController {
  constructor(
    private readonly deliveryTrackerService: DeliveryTrackerService,
  ) {}

  @Post('getTrackingInfo')
  async getTrackingInfo(@Body() body: { companyName?: string; trackingNumber?: string }) {
    const { companyName, trackingNumber } = body || {};
    if (!companyName || !trackingNumber) {
      throw new BadRequestException('companyName and trackingNumber are required');
    }
    return this.deliveryTrackerService.getTrackingInfo(companyName, trackingNumber);
  }

  @Post('getCompanyList')
  async getCompanyList() {
    return this.deliveryTrackerService.getCompanyList();
  }

  @Post('searchCarriers')
  async searchCarriers(@Body() body: { searchText?: string }) {
    const { searchText } = body || {};
    if (!searchText) {
      throw new BadRequestException('searchText is required');
    }
    return this.deliveryTrackerService.searchCarriers(searchText);
  }

  @Post('getRecommendedCarriers')
  async getRecommendedCarriers(@Body() body: { trackingNumber?: string }) {
    const { trackingNumber } = body || {};
    if (!trackingNumber) {
      throw new BadRequestException('trackingNumber is required');
    }
    return this.deliveryTrackerService.getRecommendedCarriers(trackingNumber);
  }
}


