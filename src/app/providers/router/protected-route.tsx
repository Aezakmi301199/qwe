import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PagePath } from '../../../shared/enums/page-path';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const userString = localStorage.getItem('user');
  let userToken = '';

  if (userString) {
    try {
      const userData = JSON.parse(userString);

      userToken = userData.token;
    } catch (error) {
      alert('Ошибка контекста');
    }
  }

  const checkUserToken = () => {
    setIsLoggedIn(!!userToken);

    if (!userToken) {
      navigate(PagePath.LOGIN);
    }
  };

  useEffect(() => {
    checkUserToken();
  }, [userToken]);

  return <>{isLoggedIn ? props.children : null}</>;
};

export default ProtectedRoute;
