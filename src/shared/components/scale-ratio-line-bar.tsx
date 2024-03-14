import { Box } from '@mui/material';
import { LinearIndicator, LinearIndicatorProps } from './linear-indicator';

type ScaleRatioLineBarProps = {
  dataSets: LinearIndicatorProps[];
};

export const ScaleRatioLineBar: React.FC<ScaleRatioLineBarProps> = ({ dataSets }) => {
  return (
    <Box display={'flex'} width={'100%'} justifyContent={'space-between'} padding={'0px'} gap={'2px'}>
      {dataSets.map((lineIndicatorSettings) => (
        <LinearIndicator {...lineIndicatorSettings} />
      ))}
    </Box>
  );
};
