import { Box, Tabs, Tab, useTheme } from '@mui/material';
import React from 'react';
import { TabLink } from '../../../shared/enums/tab-link.enum';
import { realEstateTabData } from '../../../shared/tab/real-estate-tab-data';

type TabProps = {
  selectedTab: TabLink;
  handleTabChange: (event: React.SyntheticEvent, newTabId: TabLink) => void;
};

export const TabControl: React.FC<TabProps> = ({ selectedTab, handleTabChange }) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          sx={{
            minHeight: '42px',
            maxHeight: '42px',
          }}
          value={selectedTab}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: {
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          {realEstateTabData.map((tab, index) => (
            <Tab
              key={tab.id}
              value={index}
              label={tab.label}
              sx={{
                textTransform: 'unset',
                padding: '9px 16px',
                fontFamily: 'Roboto',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '24px',
                letterSpacing: '0.056px',
                minHeight: '42px',
                maxHeight: '42px',
              }}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
};
