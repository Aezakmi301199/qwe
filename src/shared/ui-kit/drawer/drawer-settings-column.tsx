import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { IconButton, List, ListItem, ListItemText, Stack, Typography, useTheme } from '@mui/material';
import { ColumnHeaderSettings, DrawerContainerSettings, ResetButton } from '../../styles/styles';
import closeSettingsColumnIcon from '../../assets/icons/closeSettingsColumnIcon.svg';
import visibilityIcon from '../../assets/icons/visibilityIcon.svg';
import visibilityOffIcon from '../../assets/icons/visibilityOffIcon.svg';
import { FontSize } from '../../enums/font-size.enum';
import { FontWeight } from '../../enums/font-weight.enum';
import { FontFamily } from '../../enums/font-family.enum';
import { Anchor } from '../../enums/anchor.enum';
import { ColumnVisibilityState } from '../../types/column-visibility-state';
import { Size } from '../../enums/size.enum';
import useClickAway from '../../hooks/use-click-away';

type DrawerSettingsColumnProps = {
  state: { right: boolean };
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
  toggleColumnVisibility: (columnName: string) => void;
  setColumnVisibility: (columnVisibility: ColumnVisibilityState) => void;
  columnsViewCell: string[];
  columnNames: Record<string, string>;
  initialColumnVisibility: ColumnVisibilityState;
};

const DrawerSettingsColumn: React.FC<DrawerSettingsColumnProps> = ({
  state,
  onClose,
  toggleColumnVisibility,
  setColumnVisibility,
  columnsViewCell,
  columnNames,
  initialColumnVisibility,
}) => {
  const [isEyeOpen, setIsEyeOpen] = useState<boolean[]>(Array(columnsViewCell.length).fill(true));
  const [isShowResetButton, setIsShowResetButton] = useState<boolean>(false);
  const toggleEye = (index: number) => {
    const newEyeState = [...isEyeOpen];

    newEyeState[index] = !newEyeState[index];
    setIsEyeOpen(newEyeState);

    const hasClosedEye = newEyeState.some((isOpen) => !isOpen);

    setIsShowResetButton(hasClosedEye);
    toggleColumnVisibility(columnsViewCell[index]);
  };

  const resetColumnVisibility = () => {
    setColumnVisibility(initialColumnVisibility);
    setIsEyeOpen(Array(columnsViewCell.length).fill(true));
    setIsShowResetButton(false);
  };

  const drawerRef = useClickAway(onClose);

  const theme = useTheme();

  const list = () => (
    <DrawerContainerSettings role={'presentation'} ref={drawerRef}>
      <Stack padding={'16px'} flex={1}>
        <ColumnHeaderSettings>
          <Typography
            fontFamily={FontFamily.ROBOTO}
            fontWeight={FontWeight.SEMI_BOLD}
            fontSize={FontSize.TWENTY_FOUR_FONT}
            sx={{ color: theme.palette.text.primary }}
          >
            Настроить столбцы
          </Typography>
          <img
            onClick={onClose}
            style={{ padding: '5px' }}
            className={'closeButton'}
            alt={''}
            src={closeSettingsColumnIcon}
          />
        </ColumnHeaderSettings>
        <Box flex={1} marginTop={'8px'}>
          <List sx={{ padding: '8px 16px' }}>
            {columnsViewCell.map((value, index) => (
              <ListItem
                key={value}
                disableGutters
                secondaryAction={
                  <IconButton onClick={() => toggleEye(index)} sx={{ padding: '5px' }}>
                    <img alt={''} src={isEyeOpen[index] ? visibilityIcon : visibilityOffIcon} />
                  </IconButton>
                }
              >
                <ListItemText primary={columnNames[value]} />
              </ListItem>
            ))}
          </List>
        </Box>
        <ResetButton
          onClick={resetColumnVisibility}
          sx={{ display: isShowResetButton ? 'block' : 'none' }}
          variant={'contained'}
          size={Size.LARGE}
        >
          Сбросить
        </ResetButton>
      </Stack>
    </DrawerContainerSettings>
  );

  return (
    <React.Fragment>
      <Drawer
        anchor={Anchor.ANCHOR_RIGHT}
        open={state[Anchor.ANCHOR_RIGHT]}
        sx={{
          '.css-1160xiw-MuiPaper-root-MuiDrawer-paper': {
            backgroundColor: 'transparent !important',
            boxShadow: 'none !important',
          },
        }}
      >
        {list()}
      </Drawer>
    </React.Fragment>
  );
};

export default DrawerSettingsColumn;
