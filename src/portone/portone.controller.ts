import { Controller, Post, Body } from '@nestjs/common';
import { PortoneService } from './portone.service';

@Controller('portone')
export class PortoneController {
  constructor(private readonly portoneService: PortoneService) {}

  @Post('verify')
  async verifyPayment(@Body() body: { imp_uid: string }) {
    return this.portoneService.verifyPayment(body.imp_uid);
  }

  @Post('refund')
  async cancelPayment(@Body() body: any) {
    return this.portoneService.requestRefund(body);
  }

  @Post('webhook')
  async webhook(@Body() webhookData: any) {
    return this.portoneService.handleWebhook(webhookData);
  }
} 