import React from 'react';
import { Popover, Typography, useTheme } from '@mui/material';
import { Anchor } from '../../enums/anchor.enum';
import { PopoverAccountContainer, PopoverItemContainer } from '../../styles/styles';
import { Logout, Person } from '@mui/icons-material';
import { FontSize } from '../../enums/font-size.enum';
import { PagePath } from '../../enums/page-path';
import { userStore } from '../../../user-store.context';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

type PopoverAccountMenuProps = {
  isOpenAccountMenu: boolean;
  anchorEl: null | HTMLElement;
  handleCloseAccountMenu: () => void;
};

const PopoverAccountMenu: React.FC<PopoverAccountMenuProps> = observer(
  ({ isOpenAccountMenu, anchorEl, handleCloseAccountMenu }) => {
    const id = isOpenAccountMenu ? 'account-popover' : undefined;
    const theme = useTheme();

    return (
      <Popover
        id={id}
        open={isOpenAccountMenu}
        anchorEl={anchorEl}
        onClose={handleCloseAccountMenu}
        sx={{ top: '5px' }}
        anchorOrigin={{
          vertical: Anchor.ANCHOR_BOTTOM,
          horizontal: Anchor.ANCHOR_RIGHT,
        }}
      >
        <PopoverAccountContainer>
          <Link to={PagePath.ACCOUNT_SUBSCRIPTIONS}>
            <PopoverItemContainer>
              <Person color={'primary'} />
              <Typography color={theme.palette.text.primary} fontSize={FontSize.SIXTEENTH_FONT}>
                Личный кабинет
              </Typography>
            </PopoverItemContainer>
          </Link>
          <PopoverItemContainer onClick={userStore.logout} sx={{ cursor: 'pointer' }}>
            <Logout color={'primary'} />
            <Typography color={theme.palette.text.primary} fontSize={FontSize.SIXTEENTH_FONT}>
              Выйти
            </Typography>
          </PopoverItemContainer>
        </PopoverAccountContainer>
      </Popover>
    );
  },
);

export default PopoverAccountMenu;
