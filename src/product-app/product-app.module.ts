import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAppController } from './product-app.controller';
import { ProductAppService } from './product-app.service';
import { AuthModule } from '../auth/auth.module';
import { ProductApp } from '../entities/product-app.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductApp]),
    AuthModule
  ],
  controllers: [ProductAppController],
  providers: [ProductAppService]
})
export class ProductAppModule {} 