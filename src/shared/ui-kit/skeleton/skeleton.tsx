import { Skeleton as MuiSkeleton, SkeletonProps as MuiSkeletonProps, styled, useTheme } from '@mui/material';
import React from 'react';

enum ShapeSkeleton {
  RECTANGLE = 'rectangle',
  ECLIPSE = 'eclipse',
}

type SkeletonProps = MuiSkeletonProps & {
  shape?: ShapeSkeleton;
  position?: PositionSkeleton;
};

export enum PositionSkeleton {
  START = 'start',
  END = 'end',
}

const positionCssProperties = (position: PositionSkeleton | undefined) => {
  const theme = useTheme();

  if (position === PositionSkeleton.END) {
    return {
      background: theme.custom.skeleton.end,
    };
  }

  return {
    background: theme.custom.skeleton.start,
  };
};

const shapeCssProperties = (shape: ShapeSkeleton | undefined) => {
  if (shape === ShapeSkeleton.ECLIPSE) {
    return {
      borderRadius: '1000px',
    };
  }

  return {
    borderRadius: '8px',
  };
};

export const StyledMuiSkeleton: React.FC<SkeletonProps> = styled(MuiSkeleton)(({ position, shape }: SkeletonProps) => ({
  WebkitTransform: 'none',
  ...positionCssProperties(position),
  ...shapeCssProperties(shape),
}));

export const Skeleton: React.FC<SkeletonProps> = ({ width, shape, height, position, ...props }) => {
  return <StyledMuiSkeleton width={width ?? '100%'} height={height} position={position} shape={shape} {...props} />;
};
