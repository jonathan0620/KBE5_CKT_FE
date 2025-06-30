import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const DEFAULT_LAT = 37.5665;
const DEFAULT_LON = 126.978;
const DEFAULT_ZOOM_LEVEL = 12;

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

const customIcon = new L.Icon({
  iconUrl: '/icon/marker.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface Vehicle {
  vehicleId: number;
  registrationNumber: string;
  manufacturer: string;
  modelName: string;
  customerName: string;
  lat: string | null;
  lon: string | null;
  ang: string | null;
}

const VEHICLE_REFRESH_INTERVAL = Number(import.meta.env.VITE_VEHICLE_REFRESH_INTERVAL || 60000);

const RealtimeMonitoringPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [status, setStatus] = useState({ total: 0, running: 0, stopped: 0 });
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      setFilteredVehicles(filterVehicles(value));
    },
    [vehicles]
  );

  const filterVehicles = useCallback(
    (value: string) => {
      if (value.length === 0) {
        return vehicles;
      }
      return vehicles.filter(vehicle => vehicle.registrationNumber.toLowerCase().includes(value.toLowerCase()));
    },
    [vehicles]
  );

  const fetchVehicles = useCallback(async () => {
    try {
      const response = await api.get('/api/v1/tracking/vehicles/location');
      if (response.data.code === '000' && Array.isArray(response.data.data)) {
        setVehicles(response.data.data);
        setFilteredVehicles(response.data.data);
      } else {
        setVehicles([]);
      }
    } catch (error) {
      console.error('차량 정보 조회 실패:', error);
      setVehicles([]);
    }
  }, []);

  // 차량 정보 주기적 업데이트
  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(fetchVehicles, VEHICLE_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchVehicles]);

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

  const handleVehicleClick = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    if (vehicle.lat && vehicle.lon && mapRef.current) {
      const lat = Number(vehicle.lat);
      const lon = Number(vehicle.lon);
      mapRef.current.closePopup();
      mapRef.current.setView([lat, lon], 15);
    }
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
              onChange={handleSearchChange}
            />
            <Text type="subheading2">운행 중인 차량 목록</Text>
            <VehicleList>
              {filteredVehicles.map((vehicle, idx) => (
                <VehicleCard
                  key={`${vehicle.vehicleId}-${idx}`}
                  id={vehicle.vehicleId}
                  licensePlate={vehicle.registrationNumber}
                  carInfo={`${vehicle.manufacturer} ${vehicle.modelName} | ${vehicle.customerName}`}
                  onClick={() => handleVehicleClick(vehicle)}
                  isSelected={selectedVehicle?.vehicleId === vehicle.vehicleId}
                />
              ))}
            </VehicleList>
          </FilterWrap>
          <MapWrap>
            <MapContainer
              center={[DEFAULT_LAT, DEFAULT_LON]}
              zoom={DEFAULT_ZOOM_LEVEL}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredVehicles.map(vehicle => {
                if (vehicle.lat && vehicle.lon) {
                  const lat = Number(vehicle.lat);
                  const lon = Number(vehicle.lon);
                  return (
                    <Marker key={vehicle.vehicleId} position={[lat, lon]} icon={customIcon}>
                      <Popup closeButton={false}>
                        <div style={{ fontFamily: 'sans-serif', minWidth: 150 }}>
                          <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <img src="/icon/marker.svg" width={14} height={14} alt="icon" />
                            <span>{vehicle.registrationNumber}</span>
                          </div>
                          <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>차량 모델</span>
                              <span style={{ color: '#111' }}>
                                {vehicle.manufacturer} {vehicle.modelName}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>고객명</span>
                              <span style={{ color: '#111' }}>{vehicle.customerName}</span>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                }
                return null;
              })}
            </MapContainer>
          </MapWrap>
        </ContentWrap>
      </ContentContainer>
    </DashboardContainer>
  );
};

export default RealtimeMonitoringPage;
