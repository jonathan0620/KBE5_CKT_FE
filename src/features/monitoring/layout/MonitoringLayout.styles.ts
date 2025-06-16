import styled from 'styled-components';

export const MonitoringContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const MonitoringNavigation = styled.nav`
  display: flex;
  gap: 4px;

  & > a {
    width: 120px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-gray600);
    text-decoration: none;
    cursor: pointer;
    border-radius: 8px;

    &.active {
      color: var(--color-white);
      background: var(--color-primary);

      &:hover {
        color: var(--color-white);
      }
    }

    &:hover {
      color: var(--color-primaryDark);
    }
  }
`;
