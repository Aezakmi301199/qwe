import React, { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from '../../../widgets/layout/layout';
import { TabLink } from '../../../shared/enums/tab-link.enum';
import FlatCard from '../../../features/card/flat-card';
import TaskPageLayout from '../../../widgets/layout/task-page-layout';
import TaskPage from '../../../pages/task/task.page';
import LoginPage from '../../../pages/login/login.page';
import { PagePath } from '../../../shared/enums/page-path';
import NotFoundPage from '../../../pages/not-found/not-found.page';
import ProtectedRoute from './protected-route';
import FlatPage from '../../../pages/flat/flat.page';
import HousePage from '../../../pages/house/house.page';
import LandPage from '../../../pages/land/land.page';
import HouseCard from '../../../features/card/house-card';
import LandCard from '../../../features/card/land-card';
import MyObjectsPage from '../../../pages/objects/my-objects.page';
import FavoritePage from '../../../pages/favorite/favorite.page';
import StatTeamPage from '../../../pages/stat/stat-team.page';
import StatParserPage from '../../../pages/stat/stat-parser.page';
import AccountLayout from '../../../widgets/layout/account-layout';
import Subscriptions from '../../../features/account/components/subscriptions';
import Rates from '../../../features/account/components/rates';
import TelegramBot from '../../../features/account/components/telegram-bot';
import Payments from '../../../features/account/components/payments';
import CallHistory from '../../../features/account/components/call-history';
import ProtectedRouteByRole from './protected-route-by-role';
import { ParserRole } from '../../../shared/enums/parser-role';

const Routing = () => {
  const location = useLocation();
  const pathToTabMapping: Record<string, TabLink> = {
    flats: TabLink.FLATS,
    houses: TabLink.HOUSES,
    lands: TabLink.LANDS,
  };
  const getSelectedTabFromPathname = (pathname: string) => {
    const pathnameParts = pathname.split(PagePath.EMPTY_PATH);

    for (const key of Object.keys(pathToTabMapping)) {
      if (pathnameParts.includes(key)) {
        return pathToTabMapping[key];
      }
    }

    return TabLink.FLATS;
  };
  const [selectedTab, setSelectedTab] = useState<TabLink>(getSelectedTabFromPathname(location.pathname));
  const handleTabChange = (newTabId: TabLink) => {
    setSelectedTab(newTabId);
  };

  return (
    <Routes>
      <Route
        path={PagePath.EMPTY_PATH}
        element={
          location.pathname === PagePath.EMPTY_PATH ? (
            <Navigate to={PagePath.FLATS} />
          ) : (
            <ProtectedRoute>
              <Layout selectedTab={selectedTab} setSelectedTab={setSelectedTab} handleTabChange={handleTabChange} />
            </ProtectedRoute>
          )
        }
      >
        <Route path={PagePath.FLATS} element={<FlatPage />} />
        <Route path={PagePath.HOUSES} element={<HousePage />} />
        <Route path={PagePath.LANDS} element={<LandPage />} />
        <Route path={PagePath.FLATS_MAP} element={<FlatCard selectedTab={selectedTab} />} />
        <Route path={PagePath.HOUSES_MAP} element={<HouseCard selectedTab={selectedTab} />} />
        <Route path={PagePath.LANDS_MAP} element={<LandCard selectedTab={selectedTab} />} />
      </Route>
      <Route
        path={PagePath.EMPTY_PATH}
        element={
          <ProtectedRoute>
            <TaskPageLayout />
          </ProtectedRoute>
        }
      >
        <Route path='*' element={<NotFoundPage />} />
        <Route path={PagePath.TASKS} element={<TaskPage selectedTab={selectedTab} />} />
        <Route path={PagePath.MY_OBJECTS} element={<MyObjectsPage />} />
        <Route path={PagePath.STATS_PARSER} element={<StatParserPage />} />
        <Route
          path={PagePath.STATS_TEAM}
          element={
            <ProtectedRouteByRole
              allowedRoles={[ParserRole.MANAGER, ParserRole.MODERATOR, ParserRole.ADMINISTRATOR]}
              children={<StatTeamPage />}
            />
          }
        />
        <Route path={PagePath.FAVORITES} element={<FavoritePage />} />
      </Route>
      <Route path={PagePath.LOGIN} element={<LoginPage />} />
      <Route
        path={PagePath.EMPTY_PATH}
        element={
          <ProtectedRoute>
            <AccountLayout />
          </ProtectedRoute>
        }
      >
        <Route path={PagePath.ACCOUNT_SUBSCRIPTIONS} element={<Subscriptions />} />
        <Route path={`${PagePath.ACCOUNT_TARIFFS}/:id?`} element={<Rates />} />
        <Route path={PagePath.ACCOUNT_BOT} element={<TelegramBot />} />
        <Route path={PagePath.ACCOUNT_CALLS} element={<CallHistory />} />
        <Route path={PagePath.ACCOUNT_PAYMENTS} element={<Payments />} />
      </Route>
    </Routes>
  );
};

export default Routing;
