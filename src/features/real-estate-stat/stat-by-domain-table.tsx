import { Icon, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { theme } from '../../app/providers/theme';
import { ContainerStat } from '../../shared/styles/styles';
import { ToggleButtonRealEstate } from '../../entities/real-estate';
import { RealEstateType } from '../../shared/enums/real-estate-type.enum';
import { StatHeader } from './ui/stat-header';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { TimeRange } from '../../shared/enums/time-range.enum';
import { Author } from '../../shared/enums/author.enum';
import { useRootStore } from '../../root-store.context';
import { filterArrayByField, reduceAccumulatorByField } from '../../shared/utils/array';
import { TimeRangeSelect } from '../../shared/components/time-range-select';
import { DomainSource } from '../../entities/domain';
import { ParserDefaultAuthorName } from '../../shared/enums/parser-default-author-name';
import { separateThousand } from '../../shared/lib/separate-thousand';
import { TableCellForStat, TypographyForStatTableCell } from './ui/table-cell-for-stat';
import { StatTableFooter } from './ui/stat-table-footer';
import { TableRowLoadingComponent } from './ui/table-row-loading-component';
import { TableBodyLoadingContentComponent } from './ui/table-body-loading-component';
import { FirstTableCell } from './ui/first-table-cell';
import { useDebounce } from '../../shared/hooks/use-debounce';
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { PositionSkeleton, Skeleton } from '../../shared/ui-kit/skeleton/skeleton';
import { environments } from '../../environment';

type StatByDomainTableProps = {
  city: string;
};

type RealEstateByDomainDto = {
  author: Author;
  domain: string;
  _count: number;
};

type StatByDomain = DomainSource & {
  ownerCount: number;
  agencyCount: number;
  totalCount: number;
};

export const StatByDomainTable: React.FC<StatByDomainTableProps> = ({ city }) => {
  const loadingColumnCount = 5;
  const countRows = 3;
  const [selectedRealEstate, setSelectedRealEstate] = useState(RealEstateType.FLATS);
  const changeSelectedRealEstate = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    realEstate: RealEstateType | null,
  ) => {
    if (!realEstate) {
      return;
    }

    setSelectedRealEstate(realEstate);
  };
  const { catalogStore } = useRootStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataDomainRows, setDataDomainRows] = useState<StatByDomain[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_WEEK);

  const changeTimeRangeRealEstate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TimeRange;

    setTimeRange(value);
  };

  const fetchStatByDomain = useDebounce(
    async (city: string, selectedRealEstate: RealEstateType, timeRange: TimeRange) => {
      setIsLoading(true);

      const statByDomainTable: RealEstateByDomainDto[] = await axios
        .get(`${environments.REACT_APP_PROXY}/api/${selectedRealEstate}/statByAuthorAndDomain`, {
          params: {
            city,
            timeRange,
          },
        })
        .then((res) => res.data);

      const domainsWithData = Array.from(new Set(statByDomainTable.map((stat) => stat.domain)));
      const filteredDomainWithData = catalogStore
        .findDomains()
        .filter((domainObject) => !!domainsWithData.includes(domainObject.value));
      const filteredRealEstateByOwner = filterArrayByField(statByDomainTable, 'author', Author.OWNER);
      const filteredRealEstateByAgency = filterArrayByField(statByDomainTable, 'author', Author.AGENCY);

      const updatedDomainDataTable = filteredDomainWithData.map((domainObject: DomainSource) => {
        const realEstateByOwnerAndDomain = filterArrayByField(filteredRealEstateByOwner, 'domain', domainObject.value);
        const countByOwnerDomain = reduceAccumulatorByField(realEstateByOwnerAndDomain, '_count');
        const realEstateByAgencyAndDomain = filterArrayByField(
          filteredRealEstateByAgency,
          'domain',
          domainObject.value,
        );
        const countByAgencyDomain = reduceAccumulatorByField(realEstateByAgencyAndDomain, '_count');
        const totalCount = countByOwnerDomain + countByAgencyDomain;

        return {
          ...domainObject,
          ownerCount: countByOwnerDomain,
          agencyCount: countByAgencyDomain,
          totalCount: totalCount,
        };
      });

      setDataDomainRows(updatedDomainDataTable);
      setIsLoading(false);
    },
    TimeConvert.MILLISECONDS_IN_MILLISECONDS * 200,
  );

  const ownerCountForAllDomains = useMemo(() => {
    return reduceAccumulatorByField(dataDomainRows, 'ownerCount');
  }, [dataDomainRows]);

  const agencyCountForAllDomains = useMemo(() => {
    return reduceAccumulatorByField(dataDomainRows, 'agencyCount');
  }, [dataDomainRows]);

  const totalCountForAllDomains = useMemo(() => {
    return ownerCountForAllDomains + agencyCountForAllDomains;
  }, [dataDomainRows]);

  useEffect(() => {
    setSelectedRealEstate(RealEstateType.FLATS);
    setTimeRange(TimeRange.LAST_WEEK);
  }, [city]);

  useEffect(() => {
    fetchStatByDomain(city, selectedRealEstate, timeRange);
  }, [city, selectedRealEstate, timeRange]);

  if (isLoading) {
    return (
      <ContainerStat
        padding={`${theme.custom.base.module.third} ${theme.custom.base.module.third} ${theme.custom.base.module.third} ${theme.custom.base.module.third}`}
        direction={'column'}
        alignItems={'center'}
        alignSelf={'stretch'}
        gap={theme.custom.base.module.second}
      >
        <StatHeader
          title={'Статистика по агрегаторам'}
          endButtons={<TimeRangeSelect value={timeRange} onChange={changeTimeRangeRealEstate} width={'125px'} />}
        />
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table size='small' aria-label='a dense table' sx={{}}>
            <TableHead>
              <TableRowLoadingComponent width='170px' countRows={countRows} />
            </TableHead>
            <TableBody>
              <TableBodyLoadingContentComponent
                countColumn={loadingColumnCount}
                width='170px'
                countRows={countRows}
                skeleton={<Skeleton position={PositionSkeleton.START} height={'28px'} animation={false} />}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </ContainerStat>
    );
  }

  return (
    <ContainerStat
      padding={`${theme.custom.base.module.third} ${theme.custom.base.module.third} ${theme.custom.base.module.third} ${theme.custom.base.module.third}`}
      direction={'column'}
      alignItems={'center'}
      alignSelf={'stretch'}
      gap={theme.custom.base.module.second}
    >
      <StatHeader
        title={'Статистика по агрегаторам'}
        endButtons={
          <>
            <ToggleButtonRealEstate
              value={selectedRealEstate}
              onChange={changeSelectedRealEstate}
              sx={{ width: 'fit-content' }}
            />
            <TimeRangeSelect value={timeRange} onChange={changeTimeRangeRealEstate} width={'125px'} />
          </>
        }
      />
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table size='small' aria-label='a dense table'>
          <TableHead>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <FirstTableCell
                children={
                  <Typography variant={'body2Medium'} children={'Источник'} color={theme.palette.text.primary} />
                }
              />
              <TableCellForStat
                children={
                  <TypographyForStatTableCell variant={'body2Medium'} children={ParserDefaultAuthorName.OWNER} />
                }
              />
              <TableCellForStat
                children={
                  <TypographyForStatTableCell variant={'body2Medium'} children={ParserDefaultAuthorName.AGENCY} />
                }
              />
              <TableCellForStat
                children={<TypographyForStatTableCell variant={'body2Medium'} children={'Всего из источника'} />}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {dataDomainRows.map((domainRow) => (
              <TableRow
                key={domainRow.scriptName}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: 'rgba(19, 29, 53, 0.04)',
                    cursor: 'pointer',
                  },
                }}
              >
                <FirstTableCell
                  children={
                    <>
                      <Icon
                        sx={{
                          display: 'flex',
                          padding: '0px',
                          alignItems: 'center',
                          gap: theme.custom.button.padding.px.sm,
                          height: '20px',
                          overflow: 'visible',
                        }}
                      >
                        <img src={domainRow.logo} alt='logoDomain' width={'24px'} height={'24px'} />
                      </Icon>
                      <Typography variant={'body2'}>{domainRow.name}</Typography>
                    </>
                  }
                />
                <TableCellForStat
                  width={'260px'}
                  children={<TypographyForStatTableCell children={separateThousand(domainRow.ownerCount)} />}
                />
                <TableCellForStat
                  width={'260px'}
                  children={<TypographyForStatTableCell children={separateThousand(domainRow.agencyCount)} />}
                />
                <TableCellForStat
                  width={'260px'}
                  children={<TypographyForStatTableCell children={separateThousand(domainRow.totalCount)} />}
                />
              </TableRow>
            ))}
          </TableBody>
          <StatTableFooter
            cells={[
              separateThousand(ownerCountForAllDomains),
              separateThousand(agencyCountForAllDomains),
              separateThousand(totalCountForAllDomains),
            ]}
          />
        </Table>
      </TableContainer>
    </ContainerStat>
  );
};
