import React from 'react';
import { CardContainer, CardContent, LicensePlateText, CarInfoText } from './VehicleCard.styles';

interface VehicleCardProps {
  id: number;
  licensePlate: string;
  carInfo: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ licensePlate, carInfo, onClick, isSelected }) => {
  return (
    <CardContainer onClick={onClick} $isSelected={isSelected} style={{ cursor: 'pointer' }}>
      <CardContent>
        <LicensePlateText>{licensePlate}</LicensePlateText>
        <CarInfoText>{carInfo}</CarInfoText>
      </CardContent>
    </CardContainer>
  );
};

export default VehicleCard;
