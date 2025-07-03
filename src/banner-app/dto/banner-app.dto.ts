export class CreateBannerDto {
  banner_type: string;
  locate: string;
  title: string;
  content: string;
  file_id?: number;
}

export class SelectBannerDto {
  bannerLocate: string;
}

export interface BannerAppInfo {
  file_id: number;
  file_name: string;
  file_path: string;
  file_division: string;
  banner_app_id: number;
  banner_type: string;
  banner_locate: string;
  navigation_path: string;
  title: string;
  content: string;
  reg_dt: Date;
  reg_id: string;
}

export interface BannerAppResponse {
  success: boolean;
  message: string;
  code: string;
  data?: BannerAppInfo[];
} 