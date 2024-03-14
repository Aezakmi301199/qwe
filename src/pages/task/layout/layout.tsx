import { BodyColumnLayout, BodyRowLayout, Menu } from '../ui/ui';
import { ReactNode } from 'react';

type LayoutProps = {
  actionFilters: ReactNode;
  sidebar: ReactNode;
  mainContent?: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ actionFilters, mainContent, sidebar }) => {
  return (
    <BodyColumnLayout>
      <BodyRowLayout>
        <Menu sx={{ width: '260px' }}>
          {actionFilters}
          {sidebar}
        </Menu>
        {mainContent}
      </BodyRowLayout>
    </BodyColumnLayout>
  );
};

export default Layout;
