import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryShoppingAppController } from './inquiry-shopping-app.controller';
import { InquiryShoppingAppService } from './inquiry-shopping-app.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [InquiryShoppingAppController],
  providers: [InquiryShoppingAppService],
  exports: [InquiryShoppingAppService],
})
export class InquiryShoppingAppModule {} 