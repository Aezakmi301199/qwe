import { Size } from '../../../../shared/enums/size.enum';
import UISelect, { ValueTypeSelect } from '../../../../shared/ui-kit/select/select';
import { FlatFilters } from '../../flat';
import { Author } from '../../../../shared/enums/author.enum';
import { ParserDefaultAuthorName } from '../../../../shared/enums/parser-default-author-name';
import { Controller, useFormContext } from 'react-hook-form';

export const AuthorSelect: React.FC = () => {
  const authorValues: ValueTypeSelect[] = Object.values(Author).map((authorValue) => {
    return {
      name: ParserDefaultAuthorName[authorValue],
      value: authorValue,
    };
  });

  const { control } = useFormContext();

  return (
    <Controller
      name={FlatFilters.AUTHOR}
      control={control}
      render={({ field: { onChange, value } }) => (
        <UISelect
          fullWidth={true}
          name={FlatFilters.AUTHOR}
          id={FlatFilters.AUTHOR}
          width={'100%'}
          size={Size.SMALL}
          inputLabel={'Автор'}
          value={value}
          values={authorValues}
          onChange={onChange}
        />
      )}
    />
  );
};
