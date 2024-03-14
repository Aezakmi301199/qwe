import React from 'react';
import { Box, Tab, Tabs, useTheme } from '@mui/material';
import closeButton from '../../shared/assets/icons/closeModalIcon.svg';
import { ModalTab } from '../../shared/enums/modal-tab.enum';
import { useUserStore } from '../../user-store.context';

type TabControlModalProps = {
  currentTab: number;
  handleChangeTab: (event: React.SyntheticEvent, newValue: number) => void;
  handleClose: () => void;
};

const UITabControlModal: React.FC<TabControlModalProps> = ({ currentTab, handleChangeTab, handleClose }) => {
  const theme = useTheme();
  const userStore = useUserStore();

  return (
    <Tabs
      sx={{
        position: 'sticky',
        top: '0',
        display: 'flex',
        '& .MuiTabs-indicator': {
          display: 'none',
        },
      }}
      value={currentTab}
      onChange={handleChangeTab}
    >
      <Tab
        label='Новый поиск'
        sx={{
          textTransform: 'none',
          fontFamily: 'Roboto',
          fontSize: '24px',
          padding: '0',
          opacity: currentTab === ModalTab.FILTERS ? 1 : 0.5,
          fontWeight: 600,
          color:
            currentTab === ModalTab.FILTERS ? `${theme.palette.text.primary} !important` : theme.palette.text.secondary,
        }}
      />
      <Tab
        label='Сохраненные поиски'
        sx={{
          visibility: `${Boolean(userStore.userFilters.length) ? 'visible' : 'hidden'}`,
          textTransform: 'none',
          fontFamily: 'Roboto',
          fontSize: '24px',
          opacity: currentTab === ModalTab.SAVED_FILTERS ? 1 : 0.5,
          fontWeight: 600,
          color:
            currentTab === ModalTab.SAVED_FILTERS
              ? `${theme.palette.text.primary} !important`
              : theme.palette.text.secondary,
        }}
      />
      <Box>
        <img
          className={'closeButton'}
          onClick={handleClose}
          alt={''}
          src={closeButton}
          style={{
            position: 'absolute',
            cursor: 'pointer',
            padding: '5px',
            right: '0',
            top: '10px',
          }}
        />
      </Box>
    </Tabs>
  );
};

export default UITabControlModal;
