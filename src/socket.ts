import { createContext } from 'react';
import { io } from 'socket.io-client';
import { environments } from './environment';

const userString = localStorage.getItem('user');
let userToken = '';

if (userString) {
  const userData = JSON.parse(userString);

  userToken = userData.token;
}

const socket = io(environments.REACT_APP_PROXY, {
  auth: {
    token: userToken,
  },
});

const SocketContext = createContext<typeof socket>(socket);

export { SocketContext, socket };
