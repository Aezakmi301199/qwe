import React from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TablePagination,
  Typography,
  useTheme,
  TableRow,
  Box,
  TableCell,
  Button,
  Stack,
  TableBody,
} from '@mui/material';
import { PageLimit, InitialState } from '../../shared/enums/pagination.enum';
import { convertEnumWithNumberToArray } from '../../shared/lib/convert-enum-with-number-to-array';
import { ContainerStat } from '../../shared/styles/styles';
import { TableCellForStat, TypographyForStatTableCell } from '../real-estate-stat/ui/table-cell-for-stat';
import { UserAvatar } from '../../entities/user';
import { WorkAddressUserDto } from '../../shared/dto/work-address-user-dto';
import { FontFamily } from '../../shared/enums/font-family.enum';
import { Size } from '../../shared/enums/size.enum';
import { separateThousand } from '../../shared/lib/separate-thousand';
import { StatTeamStore } from '../../entities/user';
import { observer } from 'mobx-react-lite';
import { match, P } from 'ts-pattern';
import { ParserRole } from '../../shared/enums/parser-role';
import LabelContainer from '../../shared/ui-kit/table/label-container';
import { useUser } from '../../user-context';
import { removeMiddleName } from '../../shared/lib/remove-middle-name';

type StatTeamTableProps = {
  setOpenedManagerDrawerId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedManagerId: string;
  statTeamStore: StatTeamStore;
};

const highLevelRoles = [ParserRole.MODERATOR, ParserRole.ADMINISTRATOR];

const getTableRowHeaderByRole = (role: ParserRole) => {
  return match(role)
    .with(ParserRole.MANAGER, () => (
      <TableRow
        sx={{
          '& .MuiTableCell-root': {
            padding: '16px',
          },
        }}
      >
        <TableCell style={{ paddingLeft: '40px' }}>
          <LabelContainer label='Риэлтор' />
        </TableCell>
        <TableCell align='right'>
          <LabelContainer label='Комиссия, ₽' />
        </TableCell>
        <TableCell align='right'>
          <LabelContainer label='Звонков' secondary='За последние 30 дней' />
        </TableCell>
        <TableCell align='right'>
          <LabelContainer label='Сохранено объектов' />
        </TableCell>
        <TableCell>
          <LabelContainer label='' />
        </TableCell>
      </TableRow>
    ))
    .with(
      P.when((role) => !!highLevelRoles.includes(role)),
      () => (
        <TableRow
          sx={{
            '& .MuiTableCell-root': {
              padding: '16px',
            },
          }}
        >
          <TableCell style={{ paddingLeft: '40px' }}>
            <LabelContainer label='Риэлтор' />
          </TableCell>
          <TableCell align='right'>
            <LabelContainer label='Комиссия, ₽' />
          </TableCell>
          <TableCell align='right'>
            <LabelContainer label='Звонков' secondary='За последние 30 дней' />
          </TableCell>
          <TableCell align='right'>
            <LabelContainer label='Сохранено объектов' />
          </TableCell>
          <TableCell>
            <LabelContainer label='Менеджер' />
          </TableCell>
          <TableCell>
            <LabelContainer label='' />
          </TableCell>
        </TableRow>
      ),
    )
    .otherwise(() => null);
};

const getTableBodyByRole = ({
  role,
  statTeamStore,
  setOpenedManagerDrawerId,
}: {
  role: ParserRole;
  statTeamStore: StatTeamStore;
  setOpenedManagerDrawerId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const theme = useTheme();

  return (
    <TableBody>
      {statTeamStore.findUsers().map((realtor: WorkAddressUserDto) => {
        const totalCount = {
          callsCount: realtor.flatCallsCount + realtor.houseCallsCount + realtor.landCallsCount,
          saveCount: realtor.crmFlatCount + realtor.crmHouseCount + realtor.crmLandCount,
          amountCommission: realtor.crmFlatCommissionSum + realtor.crmHouseCommission + realtor.crmLandCommission,
        };

        return match(role)
          .with(ParserRole.MANAGER, () => (
            <TableRow
              key={realtor.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': {
                  backgroundColor: 'rgba(19, 29, 53, 0.04)',
                  cursor: 'pointer',
                },
              }}
            >
              <TableCell component='th' scope='row' padding={'none'}>
                <Stack
                  direction={'row'}
                  padding={`16px 16px 16px 40px`}
                  alignItems={'flex-start'}
                  gap={theme.custom.base.module.first}
                  flex={'1 0 0'}
                  boxSizing={'border-box'}
                  height={'inherit'}
                >
                  <Stack padding={'4px 4px 4px 4px'} direction={'row'}>
                    <UserAvatar sx={{ width: '24px', height: '24px' }} avatarUrl={realtor.avatarUrl} />
                    <Typography
                      padding={'3px 8px'}
                      variant={'body2'}
                      fontFamily={FontFamily.ROBOTO}
                      fontWeight={400}
                      fontSize={'13px'}
                      lineHeight={'18px'}
                      letterSpacing={'0.16px'}
                    >
                      {removeMiddleName(realtor.fullName)}
                    </Typography>
                  </Stack>
                </Stack>
              </TableCell>
              <TableCellForStat
                width={'260px'}
                children={<TypographyForStatTableCell children={separateThousand(totalCount.amountCommission)} />}
              />
              <TableCellForStat
                width={'260px'}
                children={<TypographyForStatTableCell children={separateThousand(totalCount.callsCount)} />}
              />
              <TableCellForStat
                width={'260px'}
                children={<TypographyForStatTableCell children={separateThousand(totalCount.saveCount)} />}
              />
              <TableCellForStat
                width={'116px'}
                children={
                  <Button
                    onClick={() => setOpenedManagerDrawerId(realtor.id)}
                    variant={'contained'}
                    color='primary'
                    size={Size.SMALL}
                    sx={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      boxShadow: 'none',
                      textTransform: 'none',
                      '&:hover': {
                        background: '#2b63be',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Подробно
                  </Button>
                }
              />
            </TableRow>
          ))
          .with(
            P.when((role) => !!highLevelRoles.includes(role)),
            () => (
              <TableRow
                key={realtor.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: 'rgba(19, 29, 53, 0.04)',
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell component='th' scope='row' padding={'none'}>
                  <Stack
                    direction={'row'}
                    padding={`16px 16px 16px 40px`}
                    alignItems={'flex-start'}
                    gap={theme.custom.base.module.first}
                    flex={'1 0 0'}
                    boxSizing={'border-box'}
                    height={'inherit'}
                  >
                    <Stack padding={'4px 4px 4px 4px'} direction={'row'}>
                      <UserAvatar sx={{ width: '24px', height: '24px' }} avatarUrl={realtor.avatarUrl} />
                      <Typography
                        padding={'3px 8px'}
                        variant={'body2'}
                        fontFamily={FontFamily.ROBOTO}
                        fontWeight={400}
                        fontSize={'13px'}
                        lineHeight={'18px'}
                        letterSpacing={'0.16px'}
                      >
                        {removeMiddleName(realtor.fullName)}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCellForStat
                  width={'260px'}
                  children={<TypographyForStatTableCell children={separateThousand(totalCount.amountCommission)} />}
                />
                <TableCellForStat
                  width={'260px'}
                  children={<TypographyForStatTableCell children={separateThousand(totalCount.callsCount)} />}
                />
                <TableCellForStat
                  width={'260px'}
                  children={<TypographyForStatTableCell children={separateThousand(totalCount.saveCount)} />}
                />
                <TableCell component='th' scope='row' padding={'none'} width={'270px'}>
                  <Box padding={`16px 16px 16px 40px`} boxSizing={'border-box'} height={'inherit'}>
                    {realtor.manager && (
                      <Box display={'flex'} padding={'4px 4px 4px 4px'} alignItems={'center'}>
                        <UserAvatar sx={{ width: '24px', height: '24px' }} avatarUrl={realtor.manager.avatarUrl} />
                        <Typography
                          padding={'3px 8px'}
                          variant={'body2'}
                          fontFamily={FontFamily.ROBOTO}
                          fontWeight={400}
                          fontSize={'13px'}
                          lineHeight={'18px'}
                          letterSpacing={'0.16px'}
                        >
                          {removeMiddleName(realtor.manager.fullName)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCellForStat
                  width={'116px'}
                  children={
                    <Button
                      onClick={() => setOpenedManagerDrawerId(realtor.id)}
                      variant={'contained'}
                      color='primary'
                      size={Size.SMALL}
                      sx={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        boxShadow: 'none',
                        textTransform: 'none',
                        '&:hover': {
                          background: '#2b63be',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      Подробно
                    </Button>
                  }
                />
              </TableRow>
            ),
          )
          .otherwise(() => null);
      })}
    </TableBody>
  );
};

export const StatTeamTable: React.FC<StatTeamTableProps> = observer(
  ({ setOpenedManagerDrawerId, selectedManagerId, statTeamStore }) => {
    const userRole = useUser().role.name;
    const theme = useTheme();

    return match(statTeamStore)
      .with(
        P.when(({ loadingUsers }) => !!loadingUsers),
        () => null,
      )
      .with(
        P.when(() => !selectedManagerId && !!highLevelRoles.includes(userRole)),
        () => (
          <Typography variant={'body1'} color={theme.palette.text.primary}>
            Выберите менеджера
          </Typography>
        ),
      )
      .with(
        P.when(() => !statTeamStore.userCount),
        () => (
          <Typography variant={'body1'} color={theme.palette.text.primary}>
            Не найдено риэлторов по выбранному менеджеру
          </Typography>
        ),
      )
      .otherwise(() => (
        <ContainerStat
          padding={`16px, 16px, 16px, 40px`}
          direction={'column'}
          alignItems={'center'}
          alignSelf={'stretch'}
          sx={{
            border: 'none',
          }}
          flexGrow={1}
          justifyContent={'start'}
          minWidth={'1500px'}
        >
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 'none', height: 'calc(100dvh - 260px)', overflowY: 'auto' }}
          >
            <Table stickyHeader size='small' aria-label='a dense table'>
              <TableHead sx={{ height: '74px' }}>{getTableRowHeaderByRole(userRole)}</TableHead>
              {getTableBodyByRole({ role: userRole, statTeamStore, setOpenedManagerDrawerId })}
            </Table>
          </TableContainer>
          <TablePagination
            component='div'
            count={statTeamStore.userCount}
            page={statTeamStore.userPage - 1}
            onPageChange={(event, newPage) => statTeamStore.setUserPage(newPage + 1)}
            rowsPerPage={statTeamStore.rowsPerPage}
            onRowsPerPageChange={(event) => {
              statTeamStore.setRowsPerPage(+event.target.value as PageLimit);
              statTeamStore.setUserPage(InitialState.FIRST);
            }}
            rowsPerPageOptions={convertEnumWithNumberToArray(PageLimit)}
            sx={{ borderTop: '1px solid #E0E0E0', width: '100%' }}
          />
        </ContainerStat>
      ));
  },
);
