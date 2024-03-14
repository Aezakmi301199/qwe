import React, { SetStateAction } from 'react';
import { Alert, IconButton } from '@mui/material';
import { ChatContainer } from '../../../shared/styles/styles';
import { catchEnterKeyDown } from '../../../shared/lib/catch-enter-key-down';
import { SendRounded } from '@mui/icons-material';
import { FontSize } from '../../../shared/enums/font-size.enum';
import { FontWeight } from '../../../shared/enums/font-weight.enum';

type CommentChatBoxProps = {
  sendComment: () => void;
  comment: string;
  setComment: React.Dispatch<SetStateAction<string>>;
};

const CommentChatBox: React.FC<CommentChatBoxProps> = ({ sendComment, comment, setComment }) => {
  return (
    <ChatContainer
      sx={{
        backgroundColor: comment.trim().length > 255 ? '#FEF1F1' : null,
        '&:last-of-type': {
          marginTop: 'auto',
        },
        '.MuiInputBase-root': {
          padding: '0',
          alignItems: 'flex-end',
        },
        '.MuiInputBase-input': {
          overflow: 'auto !important',
          maxHeight: '238px',
          padding: '16px 0 16px 24px',
        },
        '.MuiFormHelperText-root': {
          margin: 0,
        },
      }}
      value={comment}
      onChange={(event) => setComment(event.target.value)}
      onKeyDown={(event) => {
        if (comment.trim().length > 255) {
          return;
        }

        catchEnterKeyDown(event, sendComment);
      }}
      variant={'outlined'}
      placeholder={'Напишите комментарий'}
      multiline
      fullWidth
      error={comment.trim().length > 255}
      helperText={
        comment.trim().length > 255 ? (
          <Alert
            sx={{
              position: 'absolute',
              top: 0,
              borderRadius: 0,
              width: '100%',
              margin: 0,
              padding: 0,
              justifyContent: 'center',
              alignItems: 'center',
              height: '24px',
              fontSize: FontSize.THIRTEENTH_FONT,
              fontWeight: FontWeight.REGULAR,
            }}
            icon={false}
            variant='filled'
            severity='error'
          >
            Превышен лимит: 255
          </Alert>
        ) : null
      }
      InputProps={{
        endAdornment: (
          <IconButton
            disableRipple
            sx={{
              alignSelf: 'flex-end',
              padding: '8px 8px 16px 8px',
            }}
            onClick={() => {
              if (comment.trim().length > 255) {
                return;
              }

              sendComment();
            }}
          >
            <SendRounded cursor={'pointer'} />
          </IconButton>
        ),
        sx: {
          '& fieldset': { border: 'none' },
        },
      }}
    />
  );
};

export default CommentChatBox;
