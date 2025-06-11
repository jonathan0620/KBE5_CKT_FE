import React, { useState, useEffect } from 'react';

import SearchIcon from '@/assets/icons/ic-search.svg?react';

import { DashboardContainer } from '@/components/layout/DashboardLayout.styles';
import { StatCard } from '@/components/ui/card/StatCard';
import { BasicButton } from '@/components/ui/button/BasicButton';
import { TextInput } from '@/components/ui/input/input/TextInput';

import {
  ContentContainer,
  ContentWrap,
  FilterWrap,
  HeaderContainer,
  MapWrap,
  TitleWrap,
  VehicleList,
} from './RealtimeMonitoringPage.styles';
import { Text } from '@/components/ui/text/Text';
import VehicleCard from './VehicleCard';
import api from '@/libs/axios';

const RealtimeMonitoringPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [status, setStatus] = useState({ total: 0, running: 0, stopped: 0 });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/api/v1/tracking/vehicles/running');
        if (response.data.code === '000' && Array.isArray(response.data.data)) {
          const mapped = response.data.data.map((item: any) => ({
            licensePlate: item.registrationNumber,
            carInfo: `${item.manufacturer} ${item.modelName} | ${item.customerName}`,
          }));
          setVehicles(mapped);
        } else {
          setVehicles([]);
        }
      } catch (error) {
        setVehicles([]);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/api/v1/tracking/status');
        if (response.data.code === '000' && response.data.data) {
          setStatus(response.data.data);
        }
      } catch (error) {
        setStatus({ total: 0, running: 0, stopped: 0 });
      }
    };
    fetchStatus();
  }, []);

  return (
    <DashboardContainer>
      <HeaderContainer>
        <StatCard label="전체 차량" count={status.total} unit="대" unitColor="blue" />
        <StatCard label="운행중 차량" count={status.running} unit="대" unitColor="green" />
        <StatCard label="미운행 차량" count={status.stopped} unit="대" unitColor="yellow" />
        <StatCard label="미관제 차량" count={12} unit="대" unitColor="red" />
      </HeaderContainer>

      <ContentContainer>
        <TitleWrap>
          <BasicButton onClick={() => {}}>경로 보기</BasicButton>
        </TitleWrap>

        <ContentWrap>
          <FilterWrap>
            <TextInput
              type="text"
              id="search-vehicle"
              placeholder="차량번호 검색 (예: 12가 3456)"
              icon={<SearchIcon />}
              value={search}
              onChange={setSearch}
            />
            <Text type="subheading2">운행 중인 차량 목록</Text>
            <VehicleList>
              {vehicles.map((vehicle, idx) => (
                <VehicleCard
                  key={vehicle.licensePlate + idx}
                  licensePlate={vehicle.licensePlate}
                  carInfo={vehicle.carInfo}
                />
              ))}
            </VehicleList>
          </FilterWrap>
          <MapWrap>지도</MapWrap>
        </ContentWrap>
      </ContentContainer>
    </DashboardContainer>
  );
};
export default RealtimeMonitoringPage;
