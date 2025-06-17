import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PortoneController } from './portone.controller';
import { PortoneService } from './portone.service';

@Module({
  imports: [HttpModule],
  controllers: [PortoneController],
  providers: [PortoneService],
  exports: [PortoneService]
})
export class PortoneModule {} 