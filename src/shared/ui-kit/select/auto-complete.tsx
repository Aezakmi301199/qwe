import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

type AutocompleteProps = {
  size: 'small' | 'medium' | undefined;
  label: string;
  data: Array<string>;
};

const UIAutoComplete: React.FC<AutocompleteProps> = ({ size, label, data }) => {
  return (
    <Autocomplete
      size={size}
      disablePortal
      id='combo-box-demo1'
      options={data}
      sx={{
        width: '100%',
        '& .MuiInputBase-root': {
          borderRadius: '8px',
        },
      }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
};

export default UIAutoComplete;
