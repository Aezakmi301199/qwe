import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import {
  ConnectedBotContainer,
  DisableBotButton,
  InfoChip,
  TelegramContainer,
  TelegramIconContainer,
  TelegramInfoContainer,
  TitleTypography,
} from '../ui/ui';
import TelegramIconWhite from './custom-icons/telegram-icon-white';
import axios, { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router-dom';
import { InitialState } from '../../../shared/enums/pagination.enum';
import { DurationTime } from '../../../shared/enums/duration-time.enum';
import { useDebounce } from '../../../shared/hooks/use-debounce';
import { PagePath } from '../../../shared/enums/page-path';
import DefaultInfo from './telegram-bot/default-info';
import PlusInfo from './telegram-bot/plus-info';
import { ReactComponent as CheckCirclePlusIcon } from '../../../shared/assets/icons/checkCirclePlusIcon.svg';
import { theme } from '../../../app/providers/theme';
import { useUser } from '../../../user-context';
import { environments } from '../../../environment';

const TelegramBot = () => {
  const navigate = useNavigate();
  const [telegramCode, setTelegramCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorCode, setErrorCode] = useState<boolean>(false);
  const [successCode, setSuccessCode] = useState<boolean>(false);
  const user = useUser();
  const [userHasConnect, setUserHasConnect] = useState<boolean>(Boolean(user.telegramId));
  const [isEnteringCode, setIsEnteringCode] = useState<boolean>(false);
  const deleteTelegramBot = () => {
    axios.delete(`${environments.REACT_APP_PROXY}/api/users/${user.id}/messenger-code`).then(() => {
      setTelegramCode('');
      setUserHasConnect(false);
      setSuccessCode(false);
      setIsEnteringCode(false);
    });
  };

  const debouncedSendCode = useDebounce((code: string) => {
    axios
      .post(`${environments.REACT_APP_PROXY}/api/users/${user.id}/messenger-code`, { code: Number(code) })
      .then(() => {
        setUserHasConnect(true);
        setErrorCode(false);
        setSuccessCode(true);
      })
      .catch((error) => {
        if (error.response.status === HttpStatusCode.Forbidden) {
          setErrorMessage('Неверный код');
          setErrorCode(true);
        }

        if (error.response.status === HttpStatusCode.Unauthorized) {
          navigate(PagePath.LOGIN);
        }

        if (error.response.status === HttpStatusCode.Conflict) {
          setErrorMessage('Вы уже подключили бота');
          setErrorCode(true);
        }
      });
  }, DurationTime.ONE_SECOND);
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const code = event.target.value.slice(InitialState.ZERO, InitialState.SIX);

    if (code.length === InitialState.SIX) {
      debouncedSendCode(code);
    }

    setTelegramCode(code);
  };

  return (
    <Stack width={'800px'}>
      <TitleTypography>Чат-бот</TitleTypography>
      <TelegramContainer sx={{ backgroundColor: user.subscriptionPlan.isDefault ? '#F0F3FF' : '#F2F7FF' }}>
        <Stack gap={'24px'} sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TelegramIconContainer>
            <TelegramIconWhite />
          </TelegramIconContainer>
          <TelegramInfoContainer>
            <TitleTypography color={theme.palette.text.primary}>RHOOD чат-бот</TitleTypography>
            <Typography
              color={theme.palette.text.primary}
              sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
            >
              Получайте уведомления о новых объектах в Telegram Bot
            </Typography>
          </TelegramInfoContainer>
          {userHasConnect ? (
            <Box marginTop={'-12px'}>
              <ConnectedBotContainer>
                <InfoChip icon={<CheckCirclePlusIcon />} label='Подключен' variant='outlined' />
                <DisableBotButton onClick={deleteTelegramBot} variant='outlined'>
                  Отключить
                </DisableBotButton>
              </ConnectedBotContainer>
            </Box>
          ) : (
            <>
              {user.subscriptionPlan.isDefault ? (
                <DefaultInfo />
              ) : (
                <PlusInfo
                  handleCodeChange={handleCodeChange}
                  errorCode={errorCode}
                  errorMessage={errorMessage}
                  telegramCode={telegramCode}
                  successCode={successCode}
                  isEnteringCode={isEnteringCode}
                  setIsEnteringCode={setIsEnteringCode}
                  deleteTelegramBot={() => deleteTelegramBot()}
                />
              )}
            </>
          )}
        </Stack>
      </TelegramContainer>
    </Stack>
  );
};

export default TelegramBot;
