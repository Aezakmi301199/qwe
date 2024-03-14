import React, { useState } from 'react';
import { InputLabel, MenuItem, Select, SelectProps, useTheme } from '@mui/material';
import { CrmStatus } from '../model/type';
import { UiFormControl } from '../../../shared/styles/styles';
import { Size } from '../../../shared/enums/size.enum';
import { CrmStore } from '../../../shared/lib/crm-store';
import { CrmFlat, CrmHouse, CrmLand } from '../../real-estate/object/model/type';
import { observer } from 'mobx-react';
import { CrmStatusObject } from '../../../shared/enums/object-status.enum';
import { InitialState } from '../../../shared/enums/pagination.enum';

interface CrmStatusSelectProps extends SelectProps {
  statuses: CrmStatus[];
  crmRealEstateStore: CrmStore<CrmFlat | CrmHouse | CrmLand>;
}

export const CrmStatusSelect: React.FC<CrmStatusSelectProps> = observer(
  ({ statuses, crmRealEstateStore, ...props }) => {
    const theme = useTheme();
    const [selectedCrmStatus, setSelectedCrmStatus] = useState(crmRealEstateStore.filter.crmRealEstateStatus);

    return (
      <UiFormControl variant='outlined' fullWidth sx={{ borderRadius: '8px', marginLeft: '24px' }} size={Size.SMALL}>
        <InputLabel shrink>Статус в РИЭС</InputLabel>
        <Select
          {...props}
          value={selectedCrmStatus}
          onChange={(event) => {
            setSelectedCrmStatus(event.target.value as CrmStatusObject);
            crmRealEstateStore.setFilter({
              page: InitialState.FIRST,
              crmRealEstateStatus: (event.target.value as CrmStatusObject) || undefined,
            });
          }}
          multiple={false}
          notched={true}
          label={'Статус в РИЕС'}
          displayEmpty={true}
          style={{
            borderRadius: '8px',
            backgroundColor: theme.palette.common.white,
            width: '190px',
            height: '36px',
          }}
        >
          <MenuItem value={undefined}>Все</MenuItem>
          {statuses.map((status: CrmStatus) => (
            <MenuItem key={status.value} value={status.value}>
              {status.readableName}
            </MenuItem>
          ))}
        </Select>
      </UiFormControl>
    );
  },
);
