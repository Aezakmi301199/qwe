import { match, P } from 'ts-pattern';
import { PagePath } from '../enums/page-path';
import { ParserRole } from '../enums/parser-role';
import { TabDataLink } from '../ui-kit/tab-control/tabs';
import { useUser } from '../../user-context';

export const statTabData: TabDataLink[] = [
  { id: 0, label: 'Парсер', link: PagePath.STATS_PARSER },
  { id: 1, label: 'Команда', link: PagePath.STATS_TEAM },
];

export const getStabDataByRole = () => {
  const allowedRoleSeeAllStatTabData = [ParserRole.MANAGER, ParserRole.MODERATOR, ParserRole.ADMINISTRATOR];
  const userRole = useUser().role.name;

  return match(userRole)
    .with(
      P.when((role) => !!allowedRoleSeeAllStatTabData.includes(role)),
      () => statTabData,
    )
    .otherwise(() => [{ id: 0, label: 'Парсер', link: PagePath.STATS_PARSER }]);
};
