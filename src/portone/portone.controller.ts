import { Controller, Post, Body } from '@nestjs/common';
import { PortoneService } from './portone.service';

@Controller('portone')
export class PortoneController {
  constructor(private readonly portoneService: PortoneService) {}

  @Post('verify')
  async verifyPayment(@Body() body: { imp_uid: string }) {
    return this.portoneService.verifyPayment(body.imp_uid);
  }

  @Post('cancel')
  async cancelPayment(@Body() body: { imp_uid: string; reason: string }) {
    return this.portoneService.cancelPayment(body.imp_uid, body.reason);
  }

  @Post('webhook')
  async webhook(@Body() webhookData: any) {
    return this.portoneService.handleWebhook(webhookData);
  }
} 