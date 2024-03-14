import { ThemeProvider } from '@mui/material/styles';
import './index.css';
import { theme } from './providers/theme';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { Localization } from '../shared/enums/localization.enum';
import Routing from './providers/router/router';
import { socket, SocketContext } from '../socket';
import { RootStoreProvider } from '../root-store.context';
import { UserStoreProvider } from '../user-store.context';
import { UserProvider } from '../user-context';

dayjs.locale(Localization.RU);

const App = observer(() => {
  return (
    <UserProvider>
      <UserStoreProvider>
        <SocketContext.Provider value={socket}>
          <RootStoreProvider>
            <ThemeProvider theme={theme}>
              <Routing />
            </ThemeProvider>
          </RootStoreProvider>
        </SocketContext.Provider>
      </UserStoreProvider>
    </UserProvider>
  );
});

export default App;
