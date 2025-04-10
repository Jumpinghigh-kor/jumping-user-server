import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerAppController } from './banner-app.controller';
import { BannerAppService } from './banner-app.service';
import { BannerApp } from '../entities/banner-app.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([BannerApp])
  ],
  controllers: [BannerAppController],
  providers: [BannerAppService],
})
export class BannerAppModule {} 