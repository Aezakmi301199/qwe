import { Box, Popover, Typography, Checkbox, FormControlLabel, FormGroup, TextField, useTheme } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { CdnPicture } from '../../../shared/enums/cdn-picture.enum';
import {
  FilterButton,
  PopoverFilterCity,
  PopoverFilterCityBody,
  PopoverFilterCityHeader,
  SearchColumnLayout,
  SearchRowLayout,
} from '../ui/ui';
import { Size } from '../../../shared/enums/size.enum';
import { FontFamily } from '../../../shared/enums/font-family.enum';

const listNameLabels = ['Не подключенные', 'Подключенные', 'Истекающие', 'Приостановленные'];

export const CityFilters: React.FC = () => {
  const [searchCity, setSearchCity] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const theme = useTheme();

  return (
    <>
      <SearchColumnLayout>
        <SearchRowLayout>
          <TextField
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            id='outlined-start-adornment'
            size={Size.SMALL}
            type={'string'}
            sx={{
              fieldset: {
                borderColor: theme.custom.input.border.default,
                borderRadius: '8px',
              },
              input: {
                width: '100%',
                fontWeight: 400,
                color: 'rgba(26, 26, 26, 0.87)',
                fontFamily: FontFamily.ROBOTO,
                fontSize: '16px',
                fontStyle: 'normal',
                lineHeight: '150%',
                letterSpacing: '0.024px',
                '&::placeholder': {
                  color: theme.palette.text.secondary,
                },
                '&:focus': {
                  color: 'rgba(26, 26, 26, 0.87)',
                },
              },
            }}
            autoComplete={'off'}
            placeholder='Найти город'
            fullWidth
            InputProps={{
              style: {
                width: '100%',
                fontWeight: 400,
                color: theme.palette.text.secondary,
                fontFamily: FontFamily.ROBOTO,
                fontSize: '16px',
                fontStyle: 'normal',
                lineHeight: '150%',
                letterSpacing: '0.024px',
              },
            }}
          ></TextField>
          <FilterButton
            style={{ maxWidth: '52px', minWidth: '52px', height: '42px' }}
            onClick={handleClick}
            variant='outlined'
            color='inherit'
            size={Size.MEDIUM}
            startIcon={<Box component='img' src={CdnPicture.FILTER_ALT} alt='Фильтрация города' />}
          ></FilterButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              '&>.MuiPaper-root': {
                boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.08), 0px 25px 20px -5px rgba(0, 0, 0, 0.16)',
              },
            }}
          >
            <PopoverFilterCity>
              <PopoverFilterCityHeader
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography style={{ flex: '1 0 0' }} variant='body1'>
                  Фильтр
                </Typography>
                <CloseIcon onClick={handleClose} className='onCursorPointer' />
              </PopoverFilterCityHeader>
              <PopoverFilterCityBody>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                  }}
                >
                  <FormGroup sx={{ padding: '0px 12px 8px' }}>
                    {listNameLabels.map((labelName) => (
                      <FormControlLabel
                        slotProps={{
                          typography: {
                            fontFamily: FontFamily.ROBOTO,
                            fontSize: '16px',
                            lineHeight: '150%',
                            letterSpacing: '0.15px',
                          },
                        }}
                        key={labelName}
                        control={
                          <Checkbox
                            defaultChecked
                            style={{ padding: '9px' }}
                            sx={{
                              '&>.MuiSvgIcon-root': {
                                width: '20px',
                                height: '20px',
                              },
                            }}
                          />
                        }
                        label={labelName}
                      />
                    ))}
                  </FormGroup>
                </Box>
              </PopoverFilterCityBody>
            </PopoverFilterCity>
          </Popover>
        </SearchRowLayout>
      </SearchColumnLayout>
    </>
  );
};
