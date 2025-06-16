import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LayoutMain, LayoutHeader, Logo, MainNavigation } from './DashboardLayout.styles';
import type { LayoutProps } from './types';
import { DASHBOARD_NAV_ITEMS } from './constants';

import UserCircle from '@/components/ui/circle/UserCircle';
import type { UserInfo } from '@/components/ui/circle/types';

const DashboardLayout: React.FC<LayoutProps> = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const MotionLogo = motion(Logo);

  // TODO: 내 정보 조회 후 추가 필요
  const [currentUser, setCurrentUser] = useState<UserInfo | null>({ id: 1, name: '관리자' });

  // TODO: 로그아웃 로직 추가 필요
  const handleLogout = () => {
    console.log('로그아웃 버튼 클릭!');
    setCurrentUser(null);

    navigate('/login');
  };

  return (
    <LayoutMain>
      <LayoutHeader>
        <MotionLogo to="/" whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
          <img src="/icon/logo.svg" alt={title} />
          {title}
        </MotionLogo>
        <MainNavigation>
          {DASHBOARD_NAV_ITEMS.map(tab => (
            <NavLink
              key={tab.key}
              to={tab.path}
              className={({ isActive }) => {
                if (tab.path === '/') {
                  return location.pathname === '/' ? 'active' : '';
                }
                return isActive ? 'active' : '';
              }}
            >
              {tab.label}
            </NavLink>
          ))}
        </MainNavigation>

        <UserCircle userInfo={currentUser} onLogout={handleLogout} />
      </LayoutHeader>

      <Outlet />
    </LayoutMain>
  );
};

export default DashboardLayout;
