import { TabLink } from '../enums/tab-link.enum';
import { PagePath } from '../enums/page-path';

export const getPath = (selectedTab: TabLink) => {
  const tabPaths: Record<TabLink, PagePath> = {
    [TabLink.FLATS]: PagePath.FLATS,
    [TabLink.HOUSES]: PagePath.HOUSES,
    [TabLink.LANDS]: PagePath.LANDS,
  };

  return tabPaths[selectedTab] ?? PagePath.LOGIN;
};
