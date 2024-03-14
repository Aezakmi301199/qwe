import React from 'react';
import { SxProps, Tabs, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { StyledTab, TabControl } from '../../shared/styles/styles';
import { PagePath } from '../../shared/enums/page-path';

export type TabDataLink = {
  id: number;
  label: string;
  link: string;
};

type TabProps = {
  selectedTab: number;
  setSelectedTab: (selectedTab: number) => void;
  handleTabChange: (newTabId: number) => void;
  tabData: TabDataLink[];
  tabControl?: {
    sx?: SxProps;
  };
  tabs?: {
    sx?: SxProps;
  };
};

const UITabControl: React.FC<TabProps> = ({
  selectedTab,
  setSelectedTab,
  handleTabChange,
  tabData,
  tabControl,
  tabs,
}) => {
  const location = useLocation();
  const prefix = location.pathname.includes(PagePath.MAP) ? PagePath.MAP : '';
  const theme = useTheme();

  return (
    <TabControl sx={tabControl?.sx}>
      <Tabs
        value={selectedTab}
        sx={{ marginLeft: '24px', ...tabs?.sx }}
        onChange={() => handleTabChange}
        TabIndicatorProps={{
          style: {
            backgroundColor: theme.palette.text.primary,
          },
        }}
      >
        {tabData.map((tab: TabDataLink) => (
          <Link to={`${tab.link}${prefix}`} key={tab.link}>
            <StyledTab
              key={tab.id}
              value={tab.id}
              label={tab.label}
              onClick={() => setSelectedTab(tab.id)}
              sx={{
                color: selectedTab === tab.id ? theme.palette.text.primary : theme.palette.text.secondary,
              }}
            />
          </Link>
        ))}
      </Tabs>
    </TabControl>
  );
};

export default UITabControl;
