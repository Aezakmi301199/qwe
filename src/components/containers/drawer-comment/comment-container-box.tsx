import React, { useEffect, useRef } from 'react';
import { Typography, useTheme } from '@mui/material';
import { BodyCommentBox, CommentBodyBox, CommentSectionName } from '../../../shared/styles/styles';
import Box from '@mui/material/Box';
import { FontSize } from '../../../shared/enums/font-size.enum';
import { FontWeight } from '../../../shared/enums/font-weight.enum';
import { getShortName } from '../../../shared/lib/get-short-name';
import { observer } from 'mobx-react';
import { deepOrange } from '@mui/material/colors';
import { UserAvatar } from '../../../entities/user';

type CommentContainerProps = {
  name: string;
  date: string;
  comment: string;
  avatarUrl: string;
};

const CommentContainerBox: React.FC<CommentContainerProps> = observer(({ name, date, comment, avatarUrl }) => {
  const theme = useTheme();

  const commentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, []);

  return (
    <BodyCommentBox ref={commentRef}>
      <UserAvatar avatarUrl={avatarUrl} name={name} />
      <CommentSectionName>
        <CommentBodyBox>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography
              color={theme.palette.text.primary}
              fontSize={FontSize.SIXTEENTH_FONT}
              fontWeight={FontWeight.MEDIUM}
              variant={'body1'}
              sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              {getShortName(name)}
            </Typography>
          </Box>
          <Typography
            color={theme.palette.text.secondary}
            fontSize={FontSize.FOURTEENTH_FONT}
            fontWeight={FontWeight.REGULAR}
            variant={'caption'}
          >
            {date}
          </Typography>
        </CommentBodyBox>
        <Typography
          color={theme.palette.text.primary}
          fontSize={FontSize.SIXTEENTH_FONT}
          fontWeight={FontWeight.REGULAR}
          variant={'body2'}
          sx={{ wordWrap: 'break-word' }}
        >
          {comment}
        </Typography>
      </CommentSectionName>
    </BodyCommentBox>
  );
});

export default CommentContainerBox;
