import React from 'react';
import { Divider, Popover, Typography, useTheme } from '@mui/material';
import supportAgentIcon from '../../assets/icons/supportAgentIcon.svg';
import articleIcon from '../../assets/icons/articleIcon.svg';
import { ColumnContainer, PopoverContainer, PopoverItemContainer } from '../../styles/styles';
import { FontSize } from '../../enums/font-size.enum';
import { FontWeight } from '../../enums/font-weight.enum';
import { Anchor } from '../../enums/anchor.enum';
import { Link } from 'react-router-dom';
import { environments } from '../../../environment';

type PopoverHelpingMenuProps = {
  isOpen: boolean;
  anchorEl: null | HTMLElement;
  handleCloseMenu: () => void;
};

const PopoverHelpingMenu: React.FC<PopoverHelpingMenuProps> = ({ isOpen, anchorEl, handleCloseMenu }) => {
  const id = isOpen ? 'helping-popover' : undefined;
  const theme = useTheme();

  return (
    <Popover
      id={id}
      sx={{ top: '10px' }}
      open={isOpen}
      anchorEl={anchorEl}
      onClose={handleCloseMenu}
      anchorOrigin={{
        vertical: Anchor.ANCHOR_BOTTOM,
        horizontal: Anchor.ANCHOR_RIGHT,
      }}
    >
      <PopoverContainer>
        <Link to={`${environments.REACT_APP_TELEGRAM_URL}${environments.REACT_APP_TECHNICAL_SUPPORT}`} target='_blank'>
          <PopoverItemContainer>
            <img alt={''} src={supportAgentIcon} />
            <ColumnContainer>
              <Typography
                sx={{ color: theme.palette.text.primary }}
                fontSize={FontSize.SIXTEENTH_FONT}
                fontWeight={FontWeight.REGULAR}
              >
                Техническая поддержка
              </Typography>
              <Typography
                sx={{ color: theme.palette.text.secondary }}
                fontSize={FontSize.FOURTEENTH_FONT}
                fontWeight={FontWeight.REGULAR}
              >
                Если возникла проблема
              </Typography>
            </ColumnContainer>
          </PopoverItemContainer>
        </Link>
        <Link to={`${environments.REACT_APP_KB_ESOFT_TECH}`} target='_blank'>
          <PopoverItemContainer>
            <img alt={''} src={articleIcon} />
            <ColumnContainer>
              <Typography
                sx={{ color: theme.palette.text.primary }}
                fontSize={FontSize.SIXTEENTH_FONT}
                fontWeight={FontWeight.REGULAR}
              >
                Инструкция к сервису
              </Typography>
            </ColumnContainer>
          </PopoverItemContainer>
        </Link>
        <Divider sx={{ marginTop: '8px' }} />
        <Link
          to={`${environments.REACT_APP_CDN}content/cluster/rhood/c2/68ff297328dc1fcc4fed0a56d281c3d8a9fd92c2.pdf`}
          target={'_blank'}
        >
          <PopoverContainer sx={{ alignItems: 'center' }}>
            <ColumnContainer>
              <Typography
                sx={{ color: theme.palette.text.primary, marginTop: '4px' }}
                fontSize={FontSize.SIXTEENTH_FONT}
                fontWeight={FontWeight.REGULAR}
              >
                Договор оферты
              </Typography>
            </ColumnContainer>
          </PopoverContainer>
        </Link>
      </PopoverContainer>
    </Popover>
  );
};

export default PopoverHelpingMenu;
