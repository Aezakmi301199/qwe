import React, { useState } from 'react';
import loginImg from '../../shared/assets/images/loginImage.png';
import { Box, FormControl, FormHelperText, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import logo from '../../shared/assets/images/RHOOD_LOGO.svg';
import { ButtonContainer, LoginButton, LoginContainer } from '../../shared/styles/styles';
import { Size } from '../../shared/enums/size.enum';
import axios, { AxiosError } from 'axios';
import { observer } from 'mobx-react';
import { FontSize } from '../../shared/enums/font-size.enum';
import { FontWeight } from '../../shared/enums/font-weight.enum';
import { PagePath } from '../../shared/enums/page-path';
import { catchEnterKeyDown } from '../../shared/lib/catch-enter-key-down';
import { User, UserData } from '../../entities/user/model/type';
import { LocalStorageName } from '../../shared/enums/local-storage';
import { environments } from '../../environment';

const LoginPage = observer(() => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post<User & UserData>(`${environments.REACT_APP_PROXY}/api/users/login/`, {
        login: login,
        password: password,
      });
      const user = res.data;

      localStorage.clear();
      localStorage.setItem(
        LocalStorageName.USER,
        JSON.stringify({
          id: user.id,
          token: user.token,
        }),
      );
      window.location.href = PagePath.FLATS;
    } catch (error) {
      const err = error as AxiosError;
      const errorMessages: Record<number, string> = {
        401: 'Неправильно введен логин или пароль.',
        403: 'Ваш аккаунт заблокирован, обратитесь в службу поддержки парсера.',
        404: 'Город не найден. Город, в котором зарегистрирован ваш аккаунт не добавлен в базу данных парсера. Ознакомьтесь с инструкцией для подключения функционала парсера.',
        417: 'Технические неполадки, попробуйте авторизоваться позже.',
      };

      const status: number | null = err.response ? err.response.status : null;

      setErrorMessage(
        status && errorMessages[status] ? errorMessages[status] : 'Произошла ошибка при входе. Попробуйте еще раз.',
      );
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;

    setPassword(newPassword);
    setShowPassword(Boolean(newPassword));
  };

  return (
    <Stack>
      <Box className='split left'>
        <Box className='centered'>
          <img alt={''} src={logo} />
          <LoginContainer>
            <FormControl error={!!errorMessage} sx={{ width: '100%' }}>
              <TextField
                onKeyDown={(event) => catchEnterKeyDown(event, handleLogin)}
                autoComplete={'off'}
                error={!!errorMessage}
                placeholder={'Логин'}
                InputProps={{
                  sx: { borderRadius: '8px', height: '56px' },
                }}
                size={Size.SMALL}
                id='login'
                variant='outlined'
                onChange={(event) => setLogin(event.target.value)}
              />
            </FormControl>
            <FormControl error={!!errorMessage} sx={{ width: '330px' }}>
              <TextField
                onKeyDown={(event) => catchEnterKeyDown(event, handleLogin)}
                error={!!errorMessage}
                placeholder={'Пароль'}
                type={showPassword ? 'password' : 'text'}
                InputProps={{
                  sx: { borderRadius: '8px', height: '56px' },
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge='end'
                        aria-label='toggle password visibility'
                        style={{ visibility: password ? 'visible' : 'hidden' }}
                      >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                size={Size.SMALL}
                id='password'
                variant='outlined'
                value={password}
                onChange={handlePasswordChange}
              />
              {errorMessage && (
                <FormHelperText
                  sx={{
                    fontSize: FontSize.TWELFTH_FONT,
                    fontWeight: FontWeight.REGULAR,
                    fontFeatureSettings: `clig' off, 'liga' off'`,
                  }}
                >
                  {errorMessage}
                </FormHelperText>
              )}
            </FormControl>
          </LoginContainer>
          <ButtonContainer>
            <LoginButton id={'auth_button'} variant='contained' color='primary' size={Size.LARGE} onClick={handleLogin}>
              Войти
            </LoginButton>
          </ButtonContainer>
        </Box>
      </Box>
      <Box className='split right'>
        <img className='adaptive-image' src={loginImg} alt='Avatar man' />
      </Box>
    </Stack>
  );
});

export default LoginPage;
