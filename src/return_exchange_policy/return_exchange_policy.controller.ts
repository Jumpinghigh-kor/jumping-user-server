import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReturnExchangePolicyService } from './return_exchange_policy.service';
import { GetReturnExchangePolicyDto } from './dto/return_exchange_policy.dto';

@UseGuards(JwtAuthGuard)
@Controller('return-exchange-policy')
export class ReturnExchangePolicyController {
  constructor(private readonly returnExchangePolicyService: ReturnExchangePolicyService) {}

  @Post('getReturnExchangePolicyList')
  getReturnExchangePolicyList(@Body() getReturnExchangePolicyDto: GetReturnExchangePolicyDto) {
    return this.returnExchangePolicyService.getReturnExchangePolicyList(getReturnExchangePolicyDto);
  }
} 