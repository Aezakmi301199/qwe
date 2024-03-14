import { Size } from '../../../../shared/enums/size.enum';
import UISelect, { ValueTypeSelect } from '../../../../shared/ui-kit/select/select';
import { FlatFilters } from '../../flat';
import { DealTypeName } from '../../../../shared/enums/deal-type-name';
import { DealType } from '../../../../shared/enums/deal-type.enum';
import { Controller, useFormContext } from 'react-hook-form';

export const DealTypeSelect = () => {
  const dealTypeValues: ValueTypeSelect[] = Object.values(DealType).map((dealTypeValue) => {
    return {
      name: DealTypeName[dealTypeValue],
      value: dealTypeValue,
    };
  });

  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={FlatFilters.DEAL_TYPE}
      control={control}
      render={({ field: { onChange, value } }) => (
        <UISelect
          fullWidth={true}
          id={FlatFilters.DEAL_TYPE}
          width={'100%'}
          size={Size.SMALL}
          inputLabel={'Тип сделки'}
          value={value}
          values={dealTypeValues}
          onChange={(event: React.ChangeEvent) => {
            onChange(event);
            setValue(FlatFilters.PRICE_FROM, '', { shouldDirty: true });
            setValue(FlatFilters.PRICE_TO, '', { shouldDirty: true });
          }}
        />
      )}
    />
  );
};
