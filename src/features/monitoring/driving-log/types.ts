import type { TableHeader } from '@/components/ui/table/table/types';

export interface DrivingLogSummary {
  id: number;
  modelName: string;
  registrationNumber: string;
  startAt: Date;
  endAt: Date;
  startOdometer?: number | string;
  endOdometer?: number | string;
  totalDistance?: number | string;
  user: string;
}

export const DRIVINGLOG_TABLE_HEADERS: TableHeader<DrivingLogSummary>[] = [
  { label: '모델', key: 'vehicleModelName', width: '15%', align: 'center' },
  { label: '차량 번호', key: 'vehicleRegistrationNumber', width: '15%', align: 'center' },
  { label: '시작 시간', key: 'startAtFormatted', width: '20%', align: 'center' },
  { label: '종료 시간', key: 'endAtFormatted', width: '20%', align: 'center' },
  { label: '총 주행거리', key: 'totalDistance', width: '15%', align: 'center' },
  { label: '사용자', key: 'customerName', width: 'auto', align: 'center' },
];

export interface DrivingLogListRequest {
  page?: number;
  size?: number;
  vehicleNumber?: string;
  startDate?: string;
  endDate?: string;
}

export interface DrivingLogListResponse {
  list: DrivingLogSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type LatLng = {
  lat: string;
  lon: string;
};

export interface DrivingLogDetailResponse {
  drivingLogResponse: {
    id: number;
    vehicleModelName: string;
    vehicleRegistrationNumber: string;
    startAt: string;
    endAt: string;
    startOdometer: number;
    endOdometer: number;
    totalDistance: number;
    customerName: string;
  };
  routes: {
    startLat: number;
    startLon: number;
    endLat: number;
    endLon: number;
    startAt: string;
    endAt: string;
    traceLogs: LatLng[];
  }[];
}
