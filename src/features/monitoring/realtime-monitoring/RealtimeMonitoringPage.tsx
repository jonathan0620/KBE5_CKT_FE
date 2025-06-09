import React, { useState } from 'react';

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

const RealtimeMonitoringPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const vehicles = [
    {
      licensePlate: '12가 3456',
      status: '운행중',
      carInfo: '기아 K5 | 김철수',
    },
    {
      licensePlate: '34나 5678',
      status: '운행중',
      carInfo: '현대 아반떼 | 홍길동',
    },
    {
      licensePlate: '56다 7890',
      status: '운행중',
      carInfo: '현대 쏘나타 | 이영희',
    },
    {
      licensePlate: '78라 0123',
      status: '휴식중',
      carInfo: '르노삼성 QM6 | 박영희',
    },
    {
      licensePlate: '90마 4567',
      status: '정비중',
      carInfo: '쉐보레 말리부 | 최민수',
    },
    {
      licensePlate: '90마 4567',
      status: '정비중',
      carInfo: '쉐보레 말리부 | 최민수',
    },
    {
      licensePlate: '90마 4567',
      status: '정비중',
      carInfo: '쉐보레 말리부 | 최민수',
    },
    {
      licensePlate: '90마 4567',
      status: '정비중',
      carInfo: '쉐보레 말리부 | 최민수',
    },
    {
      licensePlate: '90마 4567',
      status: '정비중',
      carInfo: '쉐보레 말리부 | 최민수',
    },
    {
      licensePlate: '90마 4567',
      status: '정비중',
      carInfo: '쉐보레 말리부 | 최민수',
    },
    {
      licensePlate: '90마 4567',
      status: '정비중',
      carInfo: '쉐보레 말리부 | 최민수',
    },
    {
      licensePlate: '90마 4567',
      status: '정비중',
      carInfo: '쉐보레 말리부 | 최민수',
    },
    {
      licensePlate: '90마 4567',
      status: '정비중',
      carInfo: '쉐보레 말리부 | 최민수',
    },
    {
      licensePlate: '90마 4567',
      status: '정비중',
      carInfo: '쉐보레 말리부 | 최민수',
    },
    {
      licensePlate: '90마 4567',
      status: '정비중',
      carInfo: '쉐보레 말리부 | 최민수',
    },
    {
      licensePlate: '90마 4567',
      status: '정비중',
      carInfo: '쉐보레 말리부 | 최민수',
    },
    {
      licensePlate: '90마 4567',
      status: '정비중',
      carInfo: '쉐보레 말리부 | 최민수',
    },
  ];

  return (
    <DashboardContainer>
      <HeaderContainer>
        <StatCard label="전체 차량" count={248} unit="대" unitColor="blue" />
        <StatCard label="운행중 차량" count={124} unit="대" unitColor="green" />
        <StatCard label="미운행 차량" count={112} unit="대" unitColor="yellow" />
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
              {vehicles.map(vehicle => (
                <VehicleCard key={vehicle.licensePlate} licensePlate={vehicle.licensePlate} carInfo={vehicle.carInfo} />
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
