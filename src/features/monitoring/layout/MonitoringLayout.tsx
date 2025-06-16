import { NavLink, Outlet } from 'react-router-dom';

import { MonitoringContainer, MonitoringNavigation } from './MonitoringLayout.styles';
import type { NavItem } from '@/layouts/types';

const MONITORING_NAV_ITEMS: NavItem[] = [
  { label: '운행 일지', key: 'driving-log', path: '/monitoring' }, // 'driving-log'로 key 변경, path는 기본 경로로
  { label: '운행 내역', key: 'driving-history', path: '/monitoring/driving-history' },
];

const MonitoringLayout: React.FC = () => {
  return (
    <MonitoringContainer>
      <MonitoringNavigation>
        {MONITORING_NAV_ITEMS.map(tab => (
          <NavLink
            key={tab.key}
            to={tab.path}
            className={({ isActive }) => {
              if (tab.key === 'driving-log') {
                return location.pathname === '/monitoring' || location.pathname === '/monitoring/driving-log'
                  ? 'active'
                  : '';
              }
              return isActive ? 'active' : '';
            }}
          >
            {tab.label}
          </NavLink>
        ))}
      </MonitoringNavigation>

      <Outlet />
    </MonitoringContainer>
  );
};

export default MonitoringLayout;
