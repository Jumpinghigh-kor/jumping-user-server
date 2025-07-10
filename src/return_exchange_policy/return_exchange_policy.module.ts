import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReturnExchangePolicyController } from './return_exchange_policy.controller';
import { ReturnExchangePolicyService } from './return_exchange_policy.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([])
  ],
  controllers: [ReturnExchangePolicyController],
  providers: [ReturnExchangePolicyService],
})
export class ReturnExchangePolicyModule {} 