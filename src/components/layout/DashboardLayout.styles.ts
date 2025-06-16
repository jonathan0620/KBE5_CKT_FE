import styled from 'styled-components';

export const DashboardContainer = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const TitleContainer = styled.section`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FilterContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray300);
  border-radius: 8px;
  padding: 16px;
`;

export const FilterTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: var(--color-gray800);
`;

export const FilterWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const FilterContent = styled.div`
  width: calc(100% - 100px);
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

export const TableContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const TableTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: var(--color-gray800);
`;
