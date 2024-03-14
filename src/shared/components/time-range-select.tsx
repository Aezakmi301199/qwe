import UISelect, { ValueTypeSelect, SelectComponentProps } from '../ui-kit/select/select';
import { Size } from '../enums/size.enum';
import { TimeRange, LocalNameTimeRange } from '../enums/time-range.enum';

interface TimeRangeSelectProps extends Omit<SelectComponentProps, 'id' | 'name' | 'values'> {
  id?: string;
  name?: string;
  values?: any;
}

export const TimeRangeSelect: React.FC<TimeRangeSelectProps> = ({
  value,
  onChange,
  id,
  name,
  values,
  inputLabel,
  width,
}) => {
  const timeRangeValues: ValueTypeSelect[] = Object.values(TimeRange).map((timeRangeValue) => {
    return {
      name: LocalNameTimeRange[timeRangeValue],
      value: timeRangeValue,
    };
  });

  return (
    <UISelect
      fullWidth={true}
      name={name ?? 'timeRange'}
      id={id ?? 'timeRange'}
      size={Size.SMALL}
      inputLabel={inputLabel}
      value={value}
      values={values ?? timeRangeValues}
      onChange={onChange}
      formControl={{
        sx: {
          width: width ?? 'fit-content',
          height: '40px',
        },
      }}
    />
  );
};
