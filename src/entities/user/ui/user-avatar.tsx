import React from 'react';
import { Avatar, SxProps } from '@mui/material';
import { getInitials } from '../../../shared/lib/get-initials';
import { PhotoSize } from '../../../shared/enums/photo-size.enum';
import { environments } from '../../../environment';

type UserAvatarProps = {
  avatarUrl: string;
  name?: string;
  sx?: SxProps;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

const hashCode = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
};

const intToRGB = (i: number) => {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();

  return '00000'.substring(0, 6 - c.length) + c;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ avatarUrl, name, sx, onClick }) => {
  const initials = name ? getInitials(name) : '';
  const fullPathUrl = `${environments.REACT_APP_CDN}/${PhotoSize.EXTRA_SMALL}/${avatarUrl}`;
  const color = intToRGB(hashCode(name ?? ''));

  return (
    <Avatar
      sx={{ cursor: 'pointer', backgroundColor: `#${color}`, ...sx }}
      src={fullPathUrl}
      alt='user avatar'
      children={initials}
      onClick={onClick}
    />
  );
};
