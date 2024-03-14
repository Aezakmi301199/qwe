import { Autocomplete, Box, Stack, TextField, useTheme } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { City, CityAutoComplete } from '../../entities/city';
import { PagePath } from '../../shared/enums/page-path';
import { Size } from '../../shared/enums/size.enum';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from '../../root-store.context';
import { observer } from 'mobx-react-lite';
import UITabControl from '../../components/tabs/tab-control';
import { SortOrderSelect } from '../../shared/components/sort-order-select';
import SearchIcon from '@mui/icons-material/Search';
import { FontFamily } from '../../shared/enums/font-family.enum';
import { StatTeamTable } from '../../features/real-estate-stat-team/stat-team-table';
import { DrawerTeamInfo, StatTeamStore } from '../../entities/user';
import { useUser } from '../../user-context';
import { match, P } from 'ts-pattern';
import { ParserRole } from '../../shared/enums/parser-role';
import { PageLimit } from '../../shared/enums/pagination.enum';
import { reaction } from 'mobx';
import { debounce } from 'lodash';
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { ShortUserStatisticOrder } from '../../shared/enums/user-statistic-order.enum';
import { PageNumber } from '../../shared/enums/page-number';
import { getStabDataByRole } from '../../shared/tab/stat-tab-data';

const universalOrderBy = [
  { value: ShortUserStatisticOrder.CALLS, name: 'Звонки' },
  { value: ShortUserStatisticOrder.SAVED, name: 'Сохранено' },
  { value: ShortUserStatisticOrder.COMMISSION, name: 'Комиссия' },
];

enum TabLinkStat {
  STATS_PARSER,
  STATS_TEAM,
}

const StatTeamPage = observer(() => {
  const theme = useTheme();
  const user = useUser();
  const [tabStat, setSetTabStat] = useState(TabLinkStat.STATS_TEAM);
  const [selectedCity, setSelectedCity] = useState<string>(user.workAddress.cityId);
  const { catalogStore, cityStore } = useRootStore();
  const [statTeamStore] = useState(() => new StatTeamStore());
  const isLoadingCityAndDomain = !catalogStore.findDomains().length;
  const isLoadingCities = !cityStore.findCities().length;
  const navigate = useNavigate();
  const [openedManagerDrawerId, setOpenedManagerDrawerId] = useState<string | null>(null);
  const userRole = user.role.name;
  const highLevelRoles = [ParserRole.MODERATOR, ParserRole.ADMINISTRATOR];
  const managerSelectRef = useRef<HTMLDivElement>(null);

  const changeCity = (city: string) => {
    setSelectedCity(city);
  };

  const processingFetchData = async () => {
    await (async () => {
      if (!catalogStore.findDomains().length) {
        await catalogStore.fetchDomains();
      }

      if (!cityStore.findCities().length) {
        await cityStore.fetchData();
      }
    })();
  };

  const fetchDebounceManagers = debounce(() => {
    statTeamStore.setManagerPage(PageNumber.FIRST);
    statTeamStore.fetchManagers(user.workAddressId);
  }, TimeConvert.MILLISECONDS_IN_MILLISECONDS * 100);

  const fetchUsersAndCountUsers = () => {
    const abortController = new AbortController();

    statTeamStore.fetchUsers(user.workAddressId);
    statTeamStore.fetchUserCountData(user.workAddressId);

    return () => {
      abortController.abort();
    };
  };

  useEffect(() => {
    processingFetchData();

    match(userRole)
      .with(ParserRole.MANAGER, () => {
        statTeamStore.setSelectedManagerId(user.id);
        fetchUsersAndCountUsers();
      })
      .otherwise(() => {
        fetchDebounceManagers();
        fetchUsersAndCountUsers();
      });

    const disposeManagerPage = reaction(
      () => statTeamStore.managerPage,
      () => {
        statTeamStore.summaryFetchManagers(user.workAddressId);
      },
    );

    const disposeQueryParams = reaction(
      () => [statTeamStore.selectedManagerId, statTeamStore.searchUserQuery, statTeamStore.orderBy],
      () => {
        statTeamStore.setUserPage(PageNumber.FIRST);
        fetchUsersAndCountUsers();
      },
    );

    const disposeUserPage = reaction(
      () => [statTeamStore.userPage],
      () => {
        fetchUsersAndCountUsers();
      },
    );

    return () => {
      disposeManagerPage();
      disposeQueryParams();
      disposeUserPage();
    };
  }, []);

  const selectedUserData = useMemo(() => {
    if (!openedManagerDrawerId) {
      return null;
    }

    return statTeamStore.findUserById(openedManagerDrawerId);
  }, [openedManagerDrawerId]);

  const handleScroll = async () => {
    const container = managerSelectRef.current;

    if (!container) {
      return;
    }

    const containerHeight = container.offsetHeight;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const marginBottomPx = 25;

    const isEndContainer = containerHeight + scrollTop + marginBottomPx >= scrollHeight;
    const isLastPage: boolean =
      Math.ceil(statTeamStore.managers.length / PageLimit.FIFTEEN) === statTeamStore.managerPage;

    if (isEndContainer && isLastPage) {
      statTeamStore.setManagerPage(statTeamStore.managerPage + 1);
    }
  };

  const SortOrderSelectElement = (
    <SortOrderSelect
      height='40px'
      value={statTeamStore.orderBy}
      onChangeSortOrderHandle={(shortOrderBy, sortOrder) => statTeamStore.setCommonOrderBy(shortOrderBy, sortOrder)}
      onChangeSelectHandle={(shortOrderBy, sortOrder) => statTeamStore.setCommonOrderBy(shortOrderBy, sortOrder)}
      selectOptions={universalOrderBy}
    />
  );

  const UserSearchTextField = (
    <TextField
      id='searchInput'
      sx={{
        width: '320px',
        borderRadius: '8px',
        '.MuiInputBase-inputAdornedStart': {
          height: '24px',
          fontFamily: FontFamily.ROBOTO,
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '150%',
          letterSpacing: '0.024px',
          padding: '8px 14px',
        },
        '.MuiInputBase-inputAdornedStart::placeholder': {
          fontFamily: FontFamily.ROBOTO,
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '24px',
          letterSpacing: '0.15%',
          opacity: 1,
          color: theme.palette.text.secondary,
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.custom.border.default,
          borderRadius: '8px',
        },
      }}
      InputProps={{
        startAdornment: <SearchIcon sx={{ color: theme.palette.text.secondary }} />,
      }}
      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
        statTeamStore.setSearchUserQuery(e.target.value);
      }}
      placeholder='Риэлтор'
    />
  );

  const CityAutoCompleteElement = (
    <CityAutoComplete
      name={'city'}
      handleChange={changeCity}
      id={'city'}
      width={'260px'}
      inputLabel={'Город'}
      size={Size.SMALL}
      value={selectedCity}
      error={!selectedCity}
      availableCity={[cityStore.findCityById(user.workAddress.cityId) as City]}
    />
  );

  return (
    <Stack height={'100vh'}>
      {!isLoadingCityAndDomain && !isLoadingCities && (
        <>
          <Box sx={{ padding: `0 ${theme.custom.layout.padding.lg}` }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
              <UITabControl
                tabControl={{
                  sx: {
                    paddingTop: '0px',
                  },
                }}
                tabs={{
                  sx: {
                    marginLeft: '0px',
                  },
                }}
                selectedTab={tabStat}
                setSelectedTab={setSetTabStat}
                handleTabChange={(e) => navigate(PagePath.STATS_PARSER)}
                tabData={getStabDataByRole()}
              />
            </Box>
          </Box>
          <Stack padding={'24px'} gap={theme.custom.base.module.third} flexGrow={1}>
            <Box
              sx={{
                display: 'flex',
                gap: theme.custom.base.module.second,
              }}
            >
              {match(userRole)
                .with(ParserRole.MANAGER, () => (
                  <>
                    {CityAutoCompleteElement}
                    {UserSearchTextField}
                    {SortOrderSelectElement}
                  </>
                ))
                .with(
                  P.when((role) => !!highLevelRoles.includes(role)),
                  () => (
                    <>
                      {CityAutoCompleteElement}
                      <Autocomplete
                        disableClearable={true}
                        id={'managerAutoComplete'}
                        size={Size.SMALL}
                        options={statTeamStore.findAutoCompleteOptionManagers()}
                        style={{ width: '298px', backgroundColor: theme.palette.common.white }}
                        sx={{
                          '& .MuiInputBase-root': {
                            borderRadius: '8px',
                          },
                        }}
                        onChange={(e, newValue) => {
                          const valueId: string = newValue.id;

                          statTeamStore.setSelectedManagerId(valueId);
                        }}
                        onInputChange={(event, value) => {
                          statTeamStore.setSearchManagerQuery(value);
                          fetchDebounceManagers();
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            value={params.id}
                            size={Size.SMALL}
                            label={'Менеджер'}
                            sx={{
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.custom.border.default,
                              },
                            }}
                          />
                        )}
                        ListboxProps={{
                          ref: managerSelectRef,
                          onScroll: handleScroll,
                        }}
                      />
                      {match(statTeamStore.selectedManagerId)
                        .with(
                          P.when((managerId) => !!managerId),
                          () => (
                            <>
                              {UserSearchTextField}
                              {SortOrderSelectElement}
                            </>
                          ),
                        )
                        .otherwise(() => null)}
                    </>
                  ),
                )
                .otherwise(() => null)}
            </Box>
            <StatTeamTable
              setOpenedManagerDrawerId={setOpenedManagerDrawerId}
              selectedManagerId={statTeamStore.selectedManagerId}
              statTeamStore={statTeamStore}
            />
          </Stack>
          {openedManagerDrawerId && selectedUserData && (
            <DrawerTeamInfo
              userId={openedManagerDrawerId}
              userData={selectedUserData}
              state={{
                right: true,
              }}
              setOpenedDrawer={setOpenedManagerDrawerId}
            />
          )}
        </>
      )}
    </Stack>
  );
});

export default StatTeamPage;
