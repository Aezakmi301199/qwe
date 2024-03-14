import { Typography, Stack, styled, useTheme, SxProps } from '@mui/material';
import { ReactNode } from 'react';

type StatHeaderProps = {
  title: string;
  secondaryText?: string;
  endButtons?: ReactNode;
  width?: string;
  secondaryTypographyProps?: SxProps;
};

const Header = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: '0px',
  alignItems: 'center',
  gap: theme.custom.base.module.second,
  alignSelf: 'stretch',
  borderRadius: '0px',
}));

export const StatHeader: React.FC<StatHeaderProps> = ({
  title,
  endButtons,
  secondaryText,
  width,
  secondaryTypographyProps,
}) => {
  const theme = useTheme();

  return (
    <Header
      direction={'row'}
      padding={'0px'}
      alignItems={'center'}
      gap={theme.custom.base.module.second}
      alignSelf={'stretch'}
      borderRadius={'0px'}
      width={width}
    >
      <Stack
        padding={'0px'}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'flex-start'}
        gap={theme.custom.base.module.first}
        flex={'1 0 0'}
      >
        <Typography variant={'headline5'} color={theme.palette.text.primary}>
          {title}
        </Typography>
        {secondaryText && (
          <Typography variant={'body2'} color={theme.palette.text.secondary} sx={secondaryTypographyProps}>
            {secondaryText}
          </Typography>
        )}
      </Stack>
      {endButtons}
    </Header>
  );
};
