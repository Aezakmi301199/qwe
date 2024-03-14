import React, { SetStateAction } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { ConnectBotButton, ConnectedBotContainer, DisableBotButton, ErrorText, InfoChip } from '../../ui/ui';
import { environments } from '../../../../environment';
import { QRCode } from 'react-qrcode-logo';
import { ReactComponent as CheckCirclePlusIcon } from '../../../../shared/assets/icons/checkCirclePlusIcon.svg';
import { theme } from '../../../../app/providers/theme';
import { FontSize } from '../../../../shared/enums/font-size.enum';
import { FontWeight } from '../../../../shared/enums/font-weight.enum';

type PlusInfoProps = {
  errorCode: boolean;
  errorMessage: string;
  telegramCode: string;
  handleCodeChange(event: React.ChangeEvent<HTMLInputElement>): void;
  successCode: boolean;
  isEnteringCode: boolean;
  setIsEnteringCode: React.Dispatch<SetStateAction<boolean>>;
  deleteTelegramBot(): void;
};

const PlusInfo: React.FC<PlusInfoProps> = ({
  errorCode,
  errorMessage,
  telegramCode,
  handleCodeChange,
  successCode,
  isEnteringCode,
  setIsEnteringCode,
  deleteTelegramBot,
}) => {
  return (
    <Box>
      {successCode ? (
        <ConnectedBotContainer>
          <InfoChip icon={<CheckCirclePlusIcon />} label='Подключен' variant='outlined' />
          <DisableBotButton onClick={deleteTelegramBot} variant='outlined'>
            Отключить
          </DisableBotButton>
        </ConnectedBotContainer>
      ) : (
        <Box>
          {isEnteringCode ? (
            <Stack alignItems='center'>
              <Typography color={theme.palette.text.primary} gutterBottom>
                Введите код из Telegram
              </Typography>
              <TextField
                variant='outlined'
                error={errorCode}
                type={'number'}
                value={telegramCode}
                placeholder={'_ _ _ _ _ _'}
                onChange={handleCodeChange}
                sx={{
                  width: '330px',
                  '& fieldset': { borderRadius: '8px' },
                }}
                inputProps={{
                  style: {
                    textAlign: 'center',
                    height: '31px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    fontSize: FontSize.TWENTY_FOUR_FONT,
                    fontWeight: FontWeight.SEMI_BOLD,
                  },
                }}
              />
              {errorCode ? <ErrorText>{errorMessage}</ErrorText> : null}
            </Stack>
          ) : (
            <Box>
              <Box>
                <ConnectBotButton
                  onClick={() =>
                    window.open(`${environments.REACT_APP_TELEGRAM_URL}${environments.REACT_APP_RHOOD_BOT}`)
                  }
                >
                  Подключить чат-бот
                </ConnectBotButton>
              </Box>
              <Stack marginTop={'24px'} gap={'12px'} alignItems={'center'}>
                <QRCode
                  qrStyle={'squares'}
                  size={135}
                  fgColor={'black'}
                  logoPadding={2}
                  value={`${environments.REACT_APP_TELEGRAM_URL}${environments.REACT_APP_RHOOD_BOT}`}
                />
                <Button
                  variant={'outlined'}
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                  onClick={() => setIsEnteringCode(true)}
                >
                  Ввести код
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PlusInfo;
