import React, { createContext, ReactElement } from 'react';
import { UserStore } from './entities/user';

const UserStoreContext = createContext<UserStore>({} as UserStore);

export const userStore = new UserStore();

export const UserStoreProvider: React.FC<React.PropsWithChildren<Record<string, ReactElement>>> = ({ children }) => {
  return <UserStoreContext.Provider value={userStore}>{children}</UserStoreContext.Provider>;
};
export const useUserStore = () => React.useContext(UserStoreContext);
