import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PortoneService {
  private readonly IMP_URL = 'https://api.iamport.kr';
  
  constructor(private readonly httpService: HttpService) {}

  // 포트원 액세스 토큰 발급
  private async getAccessToken(): Promise<string> {
    try {
      const response: any = await firstValueFrom(
        this.httpService.post(`${this.IMP_URL}/users/getToken`, {
          imp_key: process.env.PORTONE_API_KEY,
          imp_secret: process.env.PORTONE_SECRET_KEY,
        })
      );
      
      return response.data.response.access_token;
    } catch (error) {
      throw new HttpException('포트원 인증 실패', HttpStatus.UNAUTHORIZED);
    }
  }

  // 결제 검증
  async verifyPayment(imp_uid: string) {
    try {
      const accessToken = await this.getAccessToken();
      
      const response: any = await firstValueFrom(
        this.httpService.get(`${this.IMP_URL}/payments/${imp_uid}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );
      
      return {
        success: true,
        data: response.data.response,
      };
    } catch (error) {
      console.error('결제 검증 실패:', error);
      throw new HttpException('결제 검증 실패', HttpStatus.BAD_REQUEST);
    }
  }

  // 결제 취소
  async cancelPayment(imp_uid: string, reason: string, amount?: number) {
    try {
      const accessToken = await this.getAccessToken();
      
      const cancelData: any = {
        imp_uid,
        reason,
      };
      
      if (amount) {
        cancelData.amount = amount;
      }
      
      const response: any = await firstValueFrom(
        this.httpService.post(`${this.IMP_URL}/payments/cancel`, cancelData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );
      
      return {
        success: true,
        data: response.data.response,
      };
    } catch (error) {
      console.error('결제 취소 실패:', error);
      throw new HttpException('결제 취소 실패', HttpStatus.BAD_REQUEST);
    }
  }

  // 웹훅 처리
  async handleWebhook(webhookData: any) {
    try {
      console.log('웹훅 수신:', webhookData);
      
      // 웹훅으로 받은 결제 정보 검증
      const paymentInfo = await this.verifyPayment(webhookData.imp_uid);
      
      // TODO: 결제 상태에 따른 비즈니스 로직 처리
      // - 결제 완료: 주문 상태 업데이트
      // - 결제 실패: 주문 취소 처리
      // - 결제 취소: 환불 처리
      
      return {
        success: true,
        message: '웹훅 처리 완료',
        data: paymentInfo.data,
      };
    } catch (error) {
      console.error('웹훅 처리 실패:', error);
      throw new HttpException('웹훅 처리 실패', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 