import { LinearProgress, keyframes, linearProgressClasses, styled, LinearProgressProps } from '@mui/material';

const indeterminate1Keyframes = keyframes({
  '0%': {
    left: '-35%',
    right: '100%',
  },
  '100%': {
    left: '0%',
    right: '0%',
  },
});

const StyledBorderLinearProgress = styled(LinearProgress)(({}) => ({
  height: '3px',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'transparent',
  },
  '& .MuiLinearProgress-bar1Indeterminate': {
    width: 'auto',
    animation: `${indeterminate1Keyframes} 4s linear infinite`,
  },
  '& .MuiLinearProgress-bar2Indeterminate': {
    display: 'none',
  },
}));

interface BorderLinearProgressProps extends LinearProgressProps {
  visible: boolean;
}

export const BorderLinearProgress: React.FC<BorderLinearProgressProps> = ({ visible }) => {
  const visibleValue = visible ? 'visible' : 'hidden';

  return <StyledBorderLinearProgress sx={{ visibility: visibleValue }}></StyledBorderLinearProgress>;
};
