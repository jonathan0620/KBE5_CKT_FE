import React from 'react';
import { CardContainer, CardContent, LicensePlateText, CarInfoText } from './VehicleCard.styles';

interface VehicleCardProps {
  licensePlate: string;
  carInfo: string;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ licensePlate, carInfo }) => {
  return (
    <CardContainer>
      <CardContent>
        <LicensePlateText>{licensePlate}</LicensePlateText>
        <CarInfoText>{carInfo}</CarInfoText>
      </CardContent>
    </CardContainer>
  );
};

export default VehicleCard;
