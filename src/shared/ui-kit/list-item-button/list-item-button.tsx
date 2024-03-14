import {
  ListItemButton as MuiListItemButton,
  ListItemText,
  styled,
  ListItemButtonProps as MuiListItemButtonProps,
  useTheme,
} from '@mui/material';

const UiListItemButton = styled(MuiListItemButton)(({ theme, selected }) => ({
  borderRadius: theme.custom.input.shape.border.radius,
  padding: `${theme.custom.base.module.first} ${theme.custom.base.module.second}`,

  '&:hover': {
    background: theme.palette.action.hover,
  },

  '&:focus': {
    background: theme.palette.action.hover,
  },

  '&&.Mui-selected': {
    ...(selected && {
      backgroundColor: theme.palette.action.selected,
    }),
  },
}));

type ListItemButtonProps = MuiListItemButtonProps & {
  label: string;
};

export const ListItemButton: React.FC<ListItemButtonProps> = ({ key, selected, onClick, label, sx }) => {
  const theme = useTheme();

  return (
    <UiListItemButton selected={selected} key={key} onClick={onClick} sx={sx}>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          variant: 'body1Medium',
          color: theme.palette.text.primary,
        }}
      />
    </UiListItemButton>
  );
};
