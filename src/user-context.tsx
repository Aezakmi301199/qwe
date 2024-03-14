import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { User } from './entities/user';
import { PagePath } from './shared/enums/page-path';
import { LocalStorageName } from './shared/enums/local-storage';
import { useLocation } from 'react-router-dom';
import { handleAxiosError } from './shared/lib/handle-axios-error';
import { Box, LinearProgress } from '@mui/material';

interface UserContextProps {
  userData: User | null;
}

const getUserDataFromStorage = () => {
  const userDataString = localStorage.getItem(LocalStorageName.USER);

  if (!userDataString) {
    window.location.href = PagePath.LOGIN;

    throw new Error();
  }

  return JSON.parse(userDataString);
};

const fetchUserData = async () => {
  try {
    const user = getUserDataFromStorage();
    const userData = await axios.get<User>(`/api/users/${user.id}`);

    return userData.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === PagePath.LOGIN;

  useEffect(() => {
    const fetchUser = async () => {
      const data = await fetchUserData();

      setUserData(data);
      setLoading(false);
    };

    if (!isLoginPage) {
      fetchUser();
    }
  }, []);

  return loading && !isLoginPage ? (
    <Box width={'100%'}>
      <LinearProgress />
    </Box>
  ) : (
    <UserContext.Provider value={{ userData }}>{children}</UserContext.Provider>
  );
};

export const useUser = (): User => {
  const context = useContext(UserContext);

  if (!context?.userData) {
    window.location.href = PagePath.LOGIN;
    throw new Error('Context error');
  }

  return context.userData;
};
