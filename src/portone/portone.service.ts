import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DataSource } from 'typeorm';

declare const db: any;
declare const dayjs: any;

@Injectable()
export class PortoneService {
  private readonly IMP_URL = 'https://api.iamport.kr';
  
  constructor(private readonly httpService: HttpService, private dataSource: DataSource) {}

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
      const pr = response?.data?.response || {};
      return {
        success: true,
        data: response.data.response,
      };
    } catch (error) {
      console.error(`[PortOne][${new Date().toISOString()}] verifyPayment: failed`, error?.response?.data || error?.message || error);
      throw new HttpException('결제 검증 실패', HttpStatus.BAD_REQUEST);
    }
  }

  // 내부 전용: 포트원 환불 API 호출
  private async requestPortOneRefundCore(
    imp_uid: string | undefined,
    merchant_uid: string | undefined,
    refundAmount: number,
    reason: string
  ): Promise<any> {
    try {
      if (!imp_uid && !merchant_uid) {
        throw new HttpException('imp_uid 또는 merchant_uid가 필요합니다.', HttpStatus.BAD_REQUEST);
      }

      const accessToken = await this.getAccessToken();
      const cancelData: any = { reason };
      if (imp_uid) cancelData.imp_uid = imp_uid;
      if (!imp_uid && merchant_uid) cancelData.merchant_uid = merchant_uid;
      if (refundAmount && refundAmount > 0) cancelData.amount = refundAmount;

      const response: any = await firstValueFrom(
        this.httpService.post(`${this.IMP_URL}/payments/cancel`, cancelData, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
      );
      
      return { success: true, data: response?.data?.response };
    } catch (error) {
      throw new HttpException('결제 취소 실패', HttpStatus.BAD_REQUEST);
    }
  }

  async requestRefund(body: RefundRequestBody): Promise<any> {
    try {
      let { imp_uid, merchant_uid, refundAmount, reason, payment_app_id, userId } = body || {} as any;
      
      let paymentRow: any = null;
      if ((!imp_uid && !merchant_uid) || typeof refundAmount !== 'number') {
        if (payment_app_id) {
          try {
            const sql = `
              SELECT
                payment_app_id
                , payment_type
                , payment_amount
                , portone_imp_uid
                , portone_merchant_uid
              FROM  member_payment_app
              WHERE payment_app_id = ?
              LIMIT 1`;
            const rows: any[] = await this.dataSource.query(sql, [payment_app_id]);
            paymentRow = rows && rows[0] ? rows[0] : null;
            if (paymentRow) {
              if (!imp_uid && paymentRow.portone_imp_uid) imp_uid = paymentRow.portone_imp_uid;
              if (!merchant_uid && paymentRow.portone_merchant_uid) merchant_uid = paymentRow.portone_merchant_uid;
              if (typeof refundAmount !== 'number') refundAmount = Number(paymentRow.payment_amount || 0);
            }
          } catch (lookupErr) {
            console.error('[PortOne] payment_app lookup error:', lookupErr);
          }
        }
      }

      const result = await this.requestPortOneRefundCore(imp_uid, merchant_uid, Number(refundAmount || 0), String(reason ?? ''));
      try {
        if (payment_app_id) {
          const updateQuery = `
            UPDATE member_payment_app SET
              payment_status = 'PAYMENT_REFUND'
              , refund_amount = COALESCE(refund_amount, 0) + ?
              , mod_dt = DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')
              , mod_id = ?
            WHERE payment_app_id = ?
          `;
          try {
            await this.dataSource.query(updateQuery, [Number(refundAmount || 0), userId || null, Number(payment_app_id)]);
          } catch (err) {
            console.error('[PortOne] Update member_payment_app error:', err);
          }
        }
      } catch (e) {
        console.error('[PortOne] Post-refund update error:', e);
      }
      return result;
    } catch (e: any) {
      const message = e?.response?.data || { message: e?.message || 'refund error' };
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
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
// Nest 서비스 메서드: 환불 요청 (컨트롤러에서 위임 호출)
export interface RefundRequestBody {
  imp_uid?: string;
  merchant_uid?: string;
  refundAmount?: number;
  reason?: string;
  payment_app_id?: number;
  order_app_id?: number;
  userId?: number;
}

 