import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DeliveryTrackerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // ---- Front logic ported: cache & rate limit ----
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 1000; // 1s
  private readonly cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Delivery Tracker company code mapping
  private readonly COMPANY_CODES: Record<string, string> = {
    CJ: 'kr.cjlogistics',
    ROZEN: 'kr.logen',
    HANJIN: 'kr.hanjin',
    LOTTE: 'kr.lotte',
    EPOST: 'kr.epost',
  };

  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLast = now - this.lastRequestTime;
    if (timeSinceLast < this.MIN_REQUEST_INTERVAL) {
      const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLast;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }

  private async getOAuth2Token(): Promise<string> {
    const clientId = this.configService.get<string>('DELIVERY_TRACKER_CLIENT_ID');
    const clientSecret = this.configService.get<string>('DELIVERY_TRACKER_CLIENT_SECRET');
    if (!clientId || !clientSecret) {
      throw new InternalServerErrorException('Delivery tracker API config missing');
    }

    try {
      const tokenUrl = 'https://auth.tracker.delivery/oauth2/token';
      const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const body = 'grant_type=client_credentials';

      const { data } = await firstValueFrom(
        this.httpService.post(tokenUrl, body, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basic}`,
          },
          timeout: 8000,
        }),
      );
      if (!data?.access_token) {
        throw new Error('OAuth2 token not returned');
      }
      return data.access_token as string;
    } catch (error: any) {
      throw new InternalServerErrorException(
        `OAuth2 token fetch failed: ${error?.message || 'unknown error'}`,
      );
    }
  }

  private async graphqlRequest(query: string, variables: Record<string, any> = {}) {
    const baseUrl = this.configService.get<string>('DELIVERY_TRACKER_BASE_URL');
    if (!baseUrl) {
      throw new InternalServerErrorException('Delivery tracker base URL missing');
    }

    try {
      const accessToken = await this.getOAuth2Token();
      const { data } = await firstValueFrom(
        this.httpService.post(
          baseUrl,
          {
            query,
            variables,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            timeout: 8000,
          },
        ),
      );

      if (data?.errors?.length) {
        throw new Error(data.errors[0]?.message || 'GraphQL error');
      }
      return data?.data;
    } catch (error: any) {
      throw new InternalServerErrorException(
        `GraphQL request failed: ${error?.message || 'unknown error'}`,
      );
    }
  }

  // ---- Public methods mirroring frontend helpers ----
  async getTrackingInfo(companyName: string, trackingNumber: string): Promise<{ success: boolean; data?: any; error?: string; isRateLimit?: boolean; }> {
    try {
      const carrierId = this.COMPANY_CODES[companyName as keyof typeof this.COMPANY_CODES];
      if (!carrierId) {
        return { success: false, error: '지원하지 않는 택배사입니다.' };
      }

      const cacheKey = `${carrierId}_${trackingNumber}`;
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return { success: true, data: cached.data };
      }

      await this.waitForRateLimit();

      const query = `
        query Track($carrierId: ID!, $trackingNumber: String!) {
          track(carrierId: $carrierId, trackingNumber: $trackingNumber) {
            lastEvent {
              time
              status { code name }
              description
              location { name }
            }
            events(first: 20) {
              edges {
                node {
                  time
                  status { code name }
                  description
                  location { name }
                }
              }
            }
          }
        }
      `;
      const variables = { carrierId, trackingNumber };
      const data = await this.graphqlRequest(query, variables);
      const trackInfo = data?.track;

      const result = {
        company: companyName,
        trackingNumber,
        status: trackInfo?.lastEvent?.status?.name || 'Unknown',
        statusCode: trackInfo?.lastEvent?.status?.code || 'UNKNOWN',
        receiver: '',
        sender: '',
        trackingDetails:
          trackInfo?.events?.edges?.map((edge: any) => ({
            date: edge.node.time,
            location: edge.node.location?.name || '',
            status: edge.node.status?.name || '',
            statusCode: edge.node.status?.code || '',
            description: edge.node.description || '',
          })) || [],
        rawData: trackInfo,
      };

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return { success: true, data: result };
    } catch (error: any) {
      if (error?.message && String(error.message).includes('rate limit')) {
        return {
          success: false,
          error: 'API 호출 제한에 걸렸습니다. 잠시 후 다시 시도해주세요.',
          isRateLimit: true,
        };
      }
      return { success: false, error: error?.message || '배송 추적 조회 실패' };
    }
  }

  async getCompanyList(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const query = `
        query Carriers($first: Int!) {
          carriers(first: $first) {
            edges { node { id name } }
          }
        }
      `;
      const variables = { first: 50 };
      const data = await this.graphqlRequest(query, variables);
      const carriers = data?.carriers?.edges?.map((edge: any) => ({
        id: edge.node.id,
        name: edge.node.name,
        code: edge.node.id,
      })) || [];
      return { success: true, data: carriers };
    } catch (error: any) {
      return { success: false, error: error?.message || '택배사 목록 조회 실패' };
    }
  }

  async searchCarriers(searchText: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const query = `
        query Carriers($searchText: String!, $first: Int!) {
          carriers(searchText: $searchText, first: $first) {
            edges { node { id name } }
          }
        }
      `;
      const variables = { searchText, first: 10 };
      const data = await this.graphqlRequest(query, variables);
      const carriers = data?.carriers?.edges?.map((edge: any) => ({
        id: edge.node.id,
        name: edge.node.name,
        code: edge.node.id,
      })) || [];
      return { success: true, data: carriers };
    } catch (error: any) {
      return { success: false, error: error?.message || '택배사 검색 실패' };
    }
  }

  async getRecommendedCarriers(trackingNumber: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const query = `
        query RecommendCarriers($trackingNumber: String!) {
          recommendCarriers(trackingNumber: $trackingNumber) {
            id
            name
            displayName
          }
        }
      `;
      const variables = { trackingNumber };
      const data = await this.graphqlRequest(query, variables);
      const carriers =
        data?.recommendCarriers?.map((carrier: any) => ({
          id: carrier.id,
          name: carrier.displayName || carrier.name,
          code: carrier.id,
        })) || [];
      return { success: true, data: carriers };
    } catch (error: any) {
      return { success: false, error: error?.message || '택배사 추천 조회 실패' };
    }
  }

  async track(params: { carrier: string; invoice: string }) {
    const baseUrl = this.configService.get<string>('DELIVERY_TRACKER_BASE_URL');
    const clientId = this.configService.get<string>('DELIVERY_TRACKER_CLIENT_ID');
    const clientSecret = this.configService.get<string>('DELIVERY_TRACKER_CLIENT_SECRET');

    if (!baseUrl || !clientId || !clientSecret) {
      throw new InternalServerErrorException('Delivery tracker API config missing');
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(baseUrl, {
          params,
          headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            'X-Client-Id': clientId,
            'X-Client-Secret': clientSecret,
          },
          timeout: 8000,
        }),
      );

      return data;
    } catch (error: any) {
      const status = error?.response?.status || 502;
      const message =
        error?.response?.data?.message || error?.message || 'Delivery tracker request failed';
      throw new InternalServerErrorException({ status, message });
    }
  }
}


