import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryShoppingAppController } from './inquiry-shopping-app.controller';
import { InquiryShoppingAppService } from './inquiry-shopping-app.service';
import { InquiryShoppingApp } from '../entities/inquiry-shopping-app.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InquiryShoppingApp]),
    AuthModule
  ],
  controllers: [InquiryShoppingAppController],
  providers: [InquiryShoppingAppService],
})
export class InquiryShoppingAppModule {} 