import React, { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import {
  Alert,
  Box,
  Button,
  ButtonProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { exampleAvailableDataTable, exampleDomains, existTaskList, expiredExistTaskList } from '../data-task';
import { RealEstateTypeUpperCase } from '../../../shared/enums/real-estate-type-upper-case.enum';
import { DealType } from '../../../shared/enums/deal-type.enum';
import SelectTaskInterval from './select-task-interval';
import { TabControl } from './tab-control';
import { MainContainer, TaskRowTableContent, TaskTableCellContent, TaskWidget } from '../ui/ui';
import { PageTitle } from './page-title';
import { SwitchTask } from './switch-task';
import { getAvailableAndExistTaskResponse } from '../model/task-city-connect-component.model';
import { DomainSource } from '../../../entities/domain';
import { TabLink } from '../../../shared/enums/tab-link.enum';
import { Size } from '../../../shared/enums/size.enum';
import RemoveIcon from '@mui/icons-material/Remove';
import { FontFamily } from '../../../shared/enums/font-family.enum';
import { IAvailableTask, Task } from '../../../entities/task';

const buttonSize: Record<string, object> = {
  [Size.SMALL]: {
    color: '#FFF',
    fontFamily: 'Roboto',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '26px' /* 173.333% */,
    letterSpacing: '0.42px',
  },
  [Size.MEDIUM]: {
    color: '#FFF',
    fontFamily: 'Roboto',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '26px' /* 173.333% */,
    letterSpacing: '0.42px',
  },
  [Size.LARGE]: {
    color: '#FFF',
    fontFamily: 'Roboto',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '26px',
    letterSpacing: '0.42px',
  },
};

const buttonBackgroundHover: Record<string, object> = {
  ['primary']: {
    '&:hover': {
      background: '#2362EA',
    },
  },
};

export const ButtonConnectCity: React.FC<ButtonProps> = ({
  size = 'small',
  variant = 'outlined',
  color = 'primary',
}) => {
  return (
    <Box>
      <Button
        size={size}
        variant={variant}
        color={color}
        sx={{
          ...buttonBackgroundHover[color],
          borderRadius: '8px',
        }}
      >
        <Typography
          sx={{
            textTransform: 'none',
            ...buttonSize[size],
          }}
        >
          Подключить
        </Typography>
      </Button>
    </Box>
  );
};

interface RowTaskDomainProps {
  domain: DomainSource;
  key: string;
  selectedTab: TabLink;
  existTaskList: Task[];
  cityTimeEnd: boolean;
}

const RowTaskDomain: React.FC<RowTaskDomainProps> = ({ domain, key, selectedTab, existTaskList, cityTimeEnd }) => {
  const selectedRealEstateType = Object.keys(RealEstateTypeUpperCase)[selectedTab];
  // Получение доступных задач по типу недвижимости
  const taskByRealEstateType = exampleAvailableDataTable.find(
    (groupTask) => groupTask.realEstateType === selectedRealEstateType,
  );
  // Получение доступных задач по типу источника
  const taskByDomainAndRealEstateType = taskByRealEstateType?.availableTasks.find(
    (task: IAvailableTask) => task.script === domain.value,
  );

  const [isAvailableTaskSale, existTaskSale] = getAvailableAndExistTaskResponse({
    taskByDomainAndRealEstateType: taskByDomainAndRealEstateType,
    realEstateType: selectedRealEstateType,
    dealType: DealType.SALE,
    domain: domain.value,
    existTaskList,
  });

  const [isAvailableTaskRentShort, existTaskRentShort] = getAvailableAndExistTaskResponse({
    taskByDomainAndRealEstateType: taskByDomainAndRealEstateType,
    realEstateType: selectedRealEstateType,
    dealType: DealType.RENT_SHORT,
    domain: domain.value,
    existTaskList,
  });
  const [isAvailableTaskRentLong, existTaskRentLong] = getAvailableAndExistTaskResponse({
    taskByDomainAndRealEstateType: taskByDomainAndRealEstateType,
    realEstateType: selectedRealEstateType,
    dealType: DealType.RENT_LONG,
    domain: domain.value,
    existTaskList,
  });

  const [stateExistTask, stateSwitchTasks] = React.useState({
    [DealType.SALE]: existTaskSale,
    [DealType.RENT_SHORT]: existTaskRentShort,
    [DealType.RENT_LONG]: existTaskRentLong,
  });

  const handleSwitchTask = (updatedTask: boolean, dealType: DealType) => {
    stateSwitchTasks({ ...stateExistTask, [dealType]: updatedTask });
  };

  return (
    <TaskRowTableContent key={key}>
      <TableCell>
        <Box>{domain.name}</Box>
      </TableCell>
      <TableCell aria-label='Покупка' padding={'none'}>
        <TaskTableCellContent>
          {isAvailableTaskSale ? (
            <>
              <SwitchTask
                setStatusTask={(taskStatus: boolean) => handleSwitchTask(taskStatus, DealType.SALE)}
                task={stateExistTask[DealType.SALE]}
                isAvailable={isAvailableTaskSale}
              />
              {stateExistTask[DealType.SALE]?.isActive && (
                <SelectTaskInterval
                  id={'statuses'}
                  size={Size.SMALL}
                  width={'104px'}
                  value={stateExistTask[DealType.SALE].interval}
                />
              )}
            </>
          ) : (
            <RemoveIcon />
          )}
        </TaskTableCellContent>
      </TableCell>
      <TableCell aria-label='Краткосрочная аренда' padding={'none'}>
        <TaskTableCellContent>
          {isAvailableTaskRentShort ? (
            <>
              <SwitchTask
                setStatusTask={(taskStatus: boolean) => handleSwitchTask(taskStatus, DealType.RENT_SHORT)}
                task={stateExistTask[DealType.RENT_SHORT]}
                isAvailable={isAvailableTaskRentShort}
              />
              {stateExistTask[DealType.RENT_SHORT]?.isActive && (
                <SelectTaskInterval
                  id={'statuses'}
                  size={Size.SMALL}
                  width={'104px'}
                  value={stateExistTask[DealType.RENT_SHORT].interval}
                />
              )}
            </>
          ) : (
            <RemoveIcon />
          )}
        </TaskTableCellContent>
      </TableCell>
      <TableCell aria-label='Долгосрочная аренда' padding={'none'}>
        <TaskTableCellContent sx={{ padding: '16px' }}>
          {isAvailableTaskRentLong ? (
            <>
              <SwitchTask
                setStatusTask={(taskStatus: boolean) => handleSwitchTask(taskStatus, DealType.RENT_LONG)}
                task={stateExistTask[DealType.RENT_LONG]}
                isAvailable={isAvailableTaskRentLong}
              />
              {stateExistTask[DealType.RENT_LONG]?.isActive && (
                <SelectTaskInterval
                  id={'statuses'}
                  size={Size.SMALL}
                  width={'104px'}
                  value={stateExistTask[DealType.RENT_LONG].interval}
                  disabled={cityTimeEnd}
                />
              )}
            </>
          ) : (
            <RemoveIcon />
          )}
        </TaskTableCellContent>
      </TableCell>
    </TaskRowTableContent>
  );
};

type TaskCityConnectComponentProps = {
  selectedCityId: string;
};

const useCity = () => {
  function getCity(cityId: string) {
    return cityId === '2'
      ? {
          name: 'Архангельск',
          secondaryText: '',
          timeEnd: false,
          isComingEndTestingPeriod: false,
          tasks: [],
        }
      : cityId === '3'
        ? {
            name: 'Астрахань',
            secondaryText: 'Тестовый период завершен 25.05.2023',
            timeEnd: true,
            isComingEndTestingPeriod: false,
            tasks: expiredExistTaskList,
          }
        : cityId === '4'
          ? {
              name: 'Анапа',
              secondaryText: 'Пробный период до 01.10.2023',
              timeEnd: false,
              isComingEndTestingPeriod: true,
              tasks: expiredExistTaskList,
            }
          : {
              name: 'Абакан',
              timeEnd: false,
              secondaryText: 'Подключен до 08.01.2023',
              isComingEndTestingPeriod: false,
              tasks: existTaskList,
            };
  }

  return {
    getCity,
  };
};

export const TaskCityConnectComponent: React.FC<TaskCityConnectComponentProps> = ({ selectedCityId }) => {
  const [selectedTab, setSelectedTab] = useState<TabLink>(TabLink.FLATS);
  const handleTabChange = (event: React.SyntheticEvent, newTabId: TabLink) => {
    setSelectedTab(newTabId);
  };

  const { getCity } = useCity();
  const city = getCity(selectedCityId);

  const theme = useTheme();

  return (
    <MainContainer item>
      <TaskWidget>
        <PageTitle
          text={city.name}
          secondaryText={city.secondaryText}
          color={
            city.timeEnd
              ? theme.palette.error.main
              : city.isComingEndTestingPeriod
                ? theme.palette.text.secondary
                : undefined
          }
          button={city.timeEnd && <ButtonConnectCity size={Size.LARGE} variant={'contained'}></ButtonConnectCity>}
        />
        {city.tasks.length ? (
          <>
            <TabControl selectedTab={selectedTab} handleTabChange={handleTabChange} />
            <TableContainer
              sx={{
                height: 'calc(100vh - 250px)',
                overflow: 'auto',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        minWidth: '192px',
                      }}
                    >
                      Площадка
                    </TableCell>
                    <TableCell style={{ padding: '16px 16px 16px 22px' }}>Покупка</TableCell>
                    <TableCell style={{ padding: '16px 16px 16px 22px' }}>Краткосрочная аренда</TableCell>
                    <TableCell style={{ padding: '16px 16px 16px 22px' }}>Долгосрочная аренда</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exampleDomains.map((domain) => (
                    <RowTaskDomain
                      key={domain.name}
                      domain={domain}
                      selectedTab={selectedTab}
                      existTaskList={city.tasks}
                      cityTimeEnd={city.timeEnd}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Alert
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: theme.custom.layout.column.container,
              fontFamily: FontFamily.ROBOTO,
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '150%',
              letterSpacing: '0.15px',
              color: theme.custom.light.blue.NINE_HUNDRED,
              '&>.MuiAlert-action': {
                padding: '4px 0px 4px 16px',
                marginRight: '0px',
              },
            }}
            action={
              <Button
                variant='contained'
                color='info'
                size={Size.MEDIUM}
                sx={{
                  color: 'white',
                  textTransform: 'unset',
                  fontFamily: FontFamily.ROBOTO,
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '24px',
                  letterSpacing: '0.056px',
                  borderRadius: '8px',
                }}
              >
                Запустить пробный период
              </Button>
            }
            icon={<InfoIcon />}
            severity='info'
          >
            Город не был ранее подключен
          </Alert>
        )}
      </TaskWidget>
    </MainContainer>
  );
};
