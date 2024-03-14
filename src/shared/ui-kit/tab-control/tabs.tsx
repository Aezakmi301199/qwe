import React from 'react';
import { theme } from '../../../app/providers/theme';
import { realEstateTabData } from '../../tab/real-estate-tab-data';
import { StyledTab, TabControl } from '../../styles/styles';
import { SxProps, Tabs } from '@mui/material';

export type TabDataLink = {
  id: number;
  label: string;
  link: string;
};

type TabsProps = {
  value: number;
  setValue: (value: number) => void;
  handleChange: (newValue: number) => void;
  tabData?: TabDataLink[];
  tabControl?: {
    sx?: SxProps;
  };
  margin?: string;
};

const TabsUI: React.FC<TabsProps> = ({
  value,
  setValue,
  handleChange,
  tabData = realEstateTabData,
  tabControl,
  margin,
}) => {
  return (
    <TabControl sx={{ borderBottom: 1, borderColor: 'divider', ...tabControl?.sx }}>
      <Tabs
        value={value}
        onChange={() => handleChange}
        sx={{ marginLeft: margin ?? '24px' }}
        TabIndicatorProps={{
          style: {
            backgroundColor: theme.palette.text.primary,
          },
        }}
      >
        {tabData.map((tab) => (
          <StyledTab
            key={tab.id}
            value={tab.id}
            label={tab.label}
            onClick={() => setValue(tab.id)}
            sx={{
              color: value === tab.id ? theme.palette.text.primary : theme.palette.text.secondary,
            }}
          />
        ))}
      </Tabs>
    </TabControl>
  );
};

export default TabsUI;
