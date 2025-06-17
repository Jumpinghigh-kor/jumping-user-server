import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticesShoppingAppController } from './notices-shopping-app.controller';
import { NoticesShoppingAppService } from './notices-shopping-app.service';
import { NoticesShoppingApp } from '../entities/notices-shopping-app.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoticesShoppingApp]),
    AuthModule
  ],
  controllers: [NoticesShoppingAppController],
  providers: [NoticesShoppingAppService]
})
export class NoticesShoppingAppModule {} 