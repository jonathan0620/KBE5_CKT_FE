import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import SearchIcon from '@/assets/icons/ic-search.svg?react';

import {
  DashboardContainer,
  FilterContainer,
  FilterContent,
  FilterWrap,
  TableContainer,
  TableTitle,
} from '@/components/layout/DashboardLayout.styles';

import { IconButton } from '@/components/ui/button/IconButton';
import { Dropdown } from '@/components/ui/input/dropdown/Dropdown';
import { TextInput } from '@/components/ui/input/input/TextInput';
import { BasicTable } from '@/components/ui/table/table/BasicTable';
import { DateInput } from '@/components/ui/input/date/DateInput';
import api from '@/libs/axios';

// -- 필터: 드롭다운 옵션 예시 ------------------------------------------------
const VEHICLE_OPTIONS = [{ label: '전체', value: '' }];

// -- 테이블 헤더 정의 --------------------------------------------------------
const VEHICLE_LOG_TABLE_HEADERS = [
  { key: 'vehicleNumber', label: '차량번호', width: '15%' },
  { key: 'companyName', label: '회사명', width: '15%' },
  { key: 'drivingDays', label: '운행일수', width: '10%' },
  { key: 'totalDistance', label: '총 주행거리', width: '15%' },
  { key: 'averageDistance', label: '평균 주행거리', width: '15%' },
  { key: 'averageDrivingTime', label: '평균 운행시간', width: '15%' },
  { key: 'drivingRate', label: '운행률', width: '15%' },
];

const WEEKLY_LOG_TABLE_HEADERS = [
  { key: 'period', label: '운행 기간', width: '40%' },
  { key: 'totalDistance', label: '총 운행거리', width: '20%' },
  { key: 'totalTime', label: '총 운행시간', width: '20%' },
  { key: 'daysCount', label: '운행 일수', width: '20%' },
];

const DAILY_LOG_TABLE_HEADERS = [
  { key: 'date', label: '운행일자', width: '30%' },
  { key: 'dayOfWeek', label: '요일', width: '20%' },
  { key: 'totalDistance', label: '총 운행거리', width: '25%' },
  { key: 'totalTime', label: '총 운행시간', width: '25%' },
];

// -- 주간/일별 영역 스타일 ----------------------------------------------------
const StyledAnalysisWrapper = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  margin-top: 24px;
`;

const StyledWeeklySection = styled.div`
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`;

const StyledDailySection = styled.div`
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`;

// -- DrivingHistoryPage 컴포넌트 ----------------------------------------------
const DrivingHistoryPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [driverKeyword, setDriverKeyword] = useState<string>('');
  const [vehicleOptions, setVehicleOptions] = useState(VEHICLE_OPTIONS);

  const [vehicleLogData, setVehicleLogData] = useState<any[]>([]);
  const [weeklyLogData, setWeeklyLogData] = useState<any[]>([]);
  const [dailyLogData, setDailyLogData] = useState<any[]>([]);
  const [selectedVehicleData, setSelectedVehicleData] = useState<any>(null);
  const [selectedWeeklyData, setSelectedWeeklyData] = useState<any>(null);
  const [lastQueryParams, setLastQueryParams] = useState<any>(null);

  // 차량번호 목록 조회
  const fetchVehicleList = async () => {
    try {
      const response = await api.get('/api/v1/vehicles');
      if (response.data.code === '000' && response.data.data?.list) {
        const options = [
          { label: '전체', value: '' },
          ...response.data.data.list.map((vehicle: any) => ({
            label: vehicle.registrationNumber,
            value: `${vehicle.id}-${vehicle.registrationNumber}`,
          })),
        ];
        setVehicleOptions(options);
      }
    } catch (error) {
      console.error('차량번호 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchVehicleList();
  }, []);

  // 차량별 운행 내역 조회
  const fetchVehicleLogs = async () => {
    if (!startDate || !endDate) {
      alert('기간을 선택해주세요.');
      return;
    }

    try {
      const from = new Date(startDate);
      from.setHours(0, 0, 0, 0);
      const to = new Date(endDate);
      to.setHours(23, 59, 59, 999);
      const registrationNumber = vehicleNumber.split('-')[1] || '';
      const params = {
        from: from.toISOString(),
        to: to.toISOString(),
        ...(registrationNumber && { registrationNumber }),
        ...(driverKeyword && { driverName: driverKeyword }),
      };
      setLastQueryParams(params);
      const response = await api.get('/api/v1/logs/summary', { params });

      console.log('차량별 운행 내역 API 응답:', response.data);

      if (Array.isArray(response.data)) {
        const data = response.data.map((item: any) => {
          const avgTime = item.averageDrivingTime ? item.averageDrivingTime.split('.')[0] : '00:00:00';

          return {
            id: `${item.registrationNumber}-${Math.random()}`,
            vehicleNumber: item.registrationNumber || '-',
            companyName: item.companyName || '-',
            drivingDays: item.drivingDays || 0,
            totalDistance: item.totalDistance || 0,
            averageDistance: item.averageDistance ? Math.round(item.averageDistance) : 0,
            averageDrivingTime: avgTime,
            drivingRate: calculateDrivingRate(item.drivingDays || 0, from.toISOString(), to.toISOString()),
          };
        });

        console.log('매핑된 차량별 데이터:', data);
        setVehicleLogData(data);
      } else {
        console.error('차량별 운행 내역 데이터 형식이 올바르지 않습니다:', response.data);
        setVehicleLogData([]);
      }
    } catch (error) {
      console.error('차량별 운행 내역 조회 실패:', error);
      setVehicleLogData([]);
    }
  };

  const calculateDrivingRate = (drivingDays: number, startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return ((drivingDays / totalDays) * 100).toFixed(1);
  };

  const handleExcelDownload = async () => {
    if (!lastQueryParams) return;
    try {
      const response = await api.get('/api/v1/logs/summary/excel', {
        params: lastQueryParams,
        responseType: 'blob',
      });

      const now = new Date();
      const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
      const fileName = `운행기록부_${timestamp}.xlsx`;

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('엑셀 다운로드에 실패했습니다.');
      console.error(error);
    }
  };

  // 차량 선택 시 주간 운행 내역 조회
  const handleVehicleSelect = async (data: any) => {
    setSelectedVehicleData(data);
    try {
      const from = new Date(startDate!);
      from.setHours(0, 0, 0, 0);

      const to = new Date(endDate!);
      to.setHours(23, 59, 59, 999);

      const response = await api.get('/api/v1/logs/summary/weekly', {
        params: {
          from: from.toISOString(),
          to: to.toISOString(),
          registrationNumber: data.vehicleNumber,
        },
      });

      console.log('주간 운행 내역 API 응답:', response.data);

      if (Array.isArray(response.data)) {
        const weeklyData = response.data.map((item: any) => ({
          id: item.weekNumber,
          period: `${item.weekStartDate} ~ ${item.weekEndDate}`,
          totalDistance: item.totalDistance,
          totalTime: item.totalDrivingTime,
          daysCount: item.drivingDays,
          registrationNumber: data.vehicleNumber,
        }));

        console.log('매핑된 주간 데이터:', weeklyData);
        setWeeklyLogData(weeklyData);
      } else {
        console.error('주간 운행 내역 데이터 형식이 올바르지 않습니다:', response.data);
        setWeeklyLogData([]);
      }
    } catch (error) {
      console.error('주간 운행 내역 조회 실패:', error);
      setWeeklyLogData([]);
    }
  };

  // 주간 데이터 선택 시 일별 운행 내역 조회
  const handleWeeklySelect = (data: any) => {
    setSelectedWeeklyData(data);
    const [weekStart, weekEnd] = data.period.split(' ~ ');
    fetchDailyLogs(weekStart, weekEnd, data.registrationNumber);
  };

  // 일별 운행 내역 조회
  const fetchDailyLogs = async (weekStart: string, weekEnd: string, registrationNumber: string) => {
    if (!registrationNumber) {
      console.error('차량 번호가 없습니다.');
      return;
    }

    try {
      const response = await api.get('/api/v1/logs/summary/daily', {
        params: {
          weekStart,
          weekEnd,
          registrationNumber,
        },
      });

      console.log('일별 운행 내역 API 응답:', response.data);

      if (response.data.code === '000' && Array.isArray(response.data.data)) {
        const dailyData = response.data.data.map((item: any) => {
          const date = new Date(item.driveDate);
          const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

          return {
            id: item.driveDate,
            date: item.driveDate,
            dayOfWeek,
            totalDistance: item.totalDistance,
            totalTime: item.totalDrivingTime,
          };
        });

        console.log('매핑된 일별 데이터:', dailyData);
        setDailyLogData(dailyData);
      } else {
        console.error('일별 운행 내역 데이터 형식이 올바르지 않습니다:', response.data);
        setDailyLogData([]);
      }
    } catch (error) {
      console.error('일별 운행 내역 조회 실패:', error);
      setDailyLogData([]);
    }
  };

  const handleDateChange = ({
    startDate: newStartDate,
    endDate: newEndDate,
  }: {
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <DashboardContainer>
      {/* ──────────── 필터 섹션 ──────────── */}
      <FilterContainer>
        <FilterWrap>
          <FilterContent>
            <DateInput
              id="date-range"
              label="기간 설정"
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
              placeholder="YYYY.MM.DD ~ YYYY.MM.DD"
              width="300px"
            />

            <Dropdown
              width="300px"
              id="vehicle-number"
              label="차량번호"
              options={vehicleOptions}
              value={vehicleNumber}
              onSelect={value => setVehicleNumber(String(value))}
            />

            <TextInput
              width="300px"
              type="text"
              id="driver-search"
              label="검색"
              placeholder="운전자명 검색"
              icon={<SearchIcon />}
              value={driverKeyword}
              onChange={value => setDriverKeyword(value)}
              onEnter={fetchVehicleLogs}
            />
          </FilterContent>

          <IconButton icon={<SearchIcon />} onClick={fetchVehicleLogs}>
            조회
          </IconButton>
        </FilterWrap>
      </FilterContainer>

      {/* ──────────── 차량별 운행 내역 테이블 ──────────── */}
      <TableContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TableTitle>차량별 운행 내역</TableTitle>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#22B14C',
              fontWeight: 700,
              fontSize: 15,
            }}
            onClick={handleExcelDownload}
            disabled={!vehicleLogData.length}
          >
            엑셀 다운로드
          </button>
        </div>
        <BasicTable
          tableHeaders={VEHICLE_LOG_TABLE_HEADERS}
          data={vehicleLogData}
          message="기간을 조회해 주세요."
          onRowClick={handleVehicleSelect}
        />
      </TableContainer>

      {/* ──────────── 주간/일별 운행 내역 ──────────── */}
      <StyledAnalysisWrapper>
        {/* 2-1. 주간 운행 내역 */}
        <StyledWeeklySection>
          <TableTitle style={{ marginBottom: '12px' }}>주간 운행 내역</TableTitle>
          <TableContainer>
            <BasicTable
              tableHeaders={WEEKLY_LOG_TABLE_HEADERS}
              data={weeklyLogData}
              message="데이터가 없습니다."
              onRowClick={handleWeeklySelect}
            />
          </TableContainer>
        </StyledWeeklySection>

        {/* 2-2. 일별 운행 내역 */}
        <StyledDailySection>
          <TableTitle style={{ marginBottom: '12px' }}>일별 운행 내역</TableTitle>
          <TableContainer>
            <BasicTable tableHeaders={DAILY_LOG_TABLE_HEADERS} data={dailyLogData} message="데이터가 없습니다." />
          </TableContainer>
        </StyledDailySection>
      </StyledAnalysisWrapper>
    </DashboardContainer>
  );
};

export default DrivingHistoryPage;
