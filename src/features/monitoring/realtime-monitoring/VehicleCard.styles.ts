import styled from 'styled-components';

interface CardContainerProps {
  $isSelected?: boolean;
}

export const CardContainer = styled.div<CardContainerProps>`
  width: 100%;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  border-radius: 6px;
  border: 1px solid ${props => (props.$isSelected ? 'var(--color-primary)' : 'var(--color-gray300)')};
  cursor: pointer;
  background-color: ${props => (props.$isSelected ? 'var(--color-primary-light)' : 'transparent')};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${props => (props.$isSelected ? 'var(--color-primary-light)' : 'var(--color-gray100)')};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

export const LicensePlateText = styled.span`
  color: var(--color-gray900);
  font-size: 14px;
  font-weight: 600;
  line-height: 16.8px;
  word-wrap: break-word;
`;

export const CarInfoText = styled.span`
  color: var(--color-gray600);
  font-size: 12px;
  font-weight: 400;
  line-height: 14.4px;
  word-wrap: break-word;
`;
