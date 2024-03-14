import React, { useState } from 'react';
import { ButtonContainerHeader, ButtonsContainer, Header, HeaderButton, IconBox } from '../../shared/styles/styles';
import logo from '../../shared/assets/images/RHOODLOGO_White.svg';
import helpOutlineIcon from '../../shared/assets/icons/helpOutlineWhiteIcon.svg';
import PopoverHelpingMenu from '../../shared/ui-kit/popover/popover-helping-menu';
import { Link, useLocation } from 'react-router-dom';
import { PagePath } from '../../shared/enums/page-path';
import { observer } from 'mobx-react-lite';
import { UserAvatar } from '../../entities/user';
import { Box } from '@mui/material';
import { FavoriteBorderOutlined } from '@mui/icons-material';
import PopoverAccountMenu from '../../shared/ui-kit/popover/popover-account-menu';
import { useUser } from '../../user-context';

type LinkHeader = {
  title: string;
  path: PagePath;
};

const linkHeaders: LinkHeader[] = [
  {
    title: 'Мои объекты',
    path: PagePath.MY_OBJECTS,
  },
  {
    title: 'Подключение городов',
    path: PagePath.ADMIN_TASKS,
  },
  {
    title: 'Статистика',
    path: PagePath.STATS_PARSER,
  },
];

const HeaderComponent = observer(() => {
  const [anchorElHelpingMenu, setAnchorElHelpingMenu] = useState<null | HTMLElement>(null);
  const [anchorElAccountMenu, setAnchorElAccountMenu] = useState<null | HTMLElement>(null);
  const handleHelpingMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElHelpingMenu(event.currentTarget);
  };
  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAccountMenu(event.currentTarget);
  };
  const handleCloseHelpingMenu = () => {
    setAnchorElHelpingMenu(null);
  };
  const handleCloseAccountMenu = () => {
    setAnchorElAccountMenu(null);
  };
  const location = useLocation();
  const isOpenHelpingMenu = Boolean(anchorElHelpingMenu);
  const isOpenAccountMenu = Boolean(anchorElAccountMenu);
  const user = useUser();

  const parserPages: string[] = [
    PagePath.FLATS,
    PagePath.FLATS_MAP,
    PagePath.HOUSES,
    PagePath.HOUSES_MAP,
    PagePath.LANDS,
    PagePath.LANDS_MAP,
  ];

  return user ? (
    <Header>
      <ButtonContainerHeader>
        <img alt={''} src={logo} onClick={() => (window.location.href = PagePath.FLATS)} />
        <ButtonsContainer>
          <HeaderButton
            onClick={() => (window.location.href = PagePath.FLATS)}
            selected={parserPages.includes(location.pathname)}
          >
            Парсер
          </HeaderButton>
          {linkHeaders.map((header) => (
            <Link to={header.path} key={header.path}>
              <HeaderButton selected={location.pathname === header.path}>
                <Box display={'flex'} alignItems={'center'} gap={'8px'}>
                  <Box>{header.title}</Box>
                </Box>
              </HeaderButton>
            </Link>
          ))}
        </ButtonsContainer>
      </ButtonContainerHeader>
      <IconBox>
        <Link to={PagePath.FAVORITES} style={{ display: 'flex' }}>
          <FavoriteBorderOutlined sx={{ color: 'white', cursor: 'pointer', padding: '8px' }} />
        </Link>
        <img className={'dropMenu'} alt={''} src={helpOutlineIcon} onClick={handleHelpingMenuOpen} />
        <UserAvatar
          onClick={handleAccountMenuOpen}
          avatarUrl={user.avatarUrl}
          name={user.fullName}
          sx={{
            marginLeft: '8px',
            border: `${user.subscriptionPlan.isDefault ? 'none' : '4px solid #828DF8'}`,
          }}
        />
        <PopoverHelpingMenu
          isOpen={isOpenHelpingMenu}
          anchorEl={anchorElHelpingMenu}
          handleCloseMenu={handleCloseHelpingMenu}
        />
        <PopoverAccountMenu
          isOpenAccountMenu={isOpenAccountMenu}
          anchorEl={anchorElAccountMenu}
          handleCloseAccountMenu={handleCloseAccountMenu}
        />
      </IconBox>
    </Header>
  ) : null;
});

export default HeaderComponent;
