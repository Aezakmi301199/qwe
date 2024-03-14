import { Button, styled } from '@mui/material';

export const ObjectButton = styled(Button)({
  borderRadius: '8px',
  textTransform: 'none',
  width: '108px',
  padding: '4px 10px',
  height: '30px',
  boxShadow: 'none',
  '&:hover': {
    background: '#2b63be',
    boxShadow: 'none',
  },
});
