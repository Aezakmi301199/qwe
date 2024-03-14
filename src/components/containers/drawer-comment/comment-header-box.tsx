import React from 'react';
import { Stack, Typography, useTheme } from '@mui/material';
import { FontSize } from '../../../shared/enums/font-size.enum';
import { FontWeight } from '../../../shared/enums/font-weight.enum';
import Box from '@mui/material/Box';
import closeButton from '../../../shared/assets/icons/closeModalIcon.svg';
import { HeaderCommentBox } from '../../../shared/styles/styles';
import { observer } from 'mobx-react';
import { Flat } from '../../../entities/real-estate/flat';
import { Land } from '../../../entities/real-estate/land';
import { Store } from '../../../shared/lib/store';
import { House } from '../../../entities/real-estate/house';

type CommentHeaderContainerProps = {
  showHeader: boolean;
  primaryText?: string;
  secondaryText?: string;
  setOpenedDrawerCommentId: (id: string | null) => void;
  onClose?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  store: Store<Flat | House | Land>;
};

const CommentHeaderBox: React.FC<CommentHeaderContainerProps> = observer(
  ({ showHeader, primaryText, secondaryText, onClose, setOpenedDrawerCommentId, store }) => {
    const theme = useTheme();

    const closeCommentDrawer = () => {
      store.clearComments();
      setOpenedDrawerCommentId(null);
    };

    return (
      <HeaderCommentBox>
        <Stack direction={'column'}>
          <Typography fontSize={FontSize.TWENTY_FOUR_FONT} fontWeight={FontWeight.SEMI_BOLD}>
            Комментарии
          </Typography>
          {showHeader && (
            <>
              <Typography color={theme.palette.text.secondary} fontSize={FontSize.FOURTEENTH_FONT}>
                {primaryText}
              </Typography>
              <>
                <Typography color={theme.palette.text.secondary} fontSize={FontSize.FOURTEENTH_FONT}>
                  {secondaryText}
                </Typography>
              </>
            </>
          )}
        </Stack>
        <Box onClick={onClose ? onClose : closeCommentDrawer}>
          <img className={'closeButton'} alt={''} src={closeButton} />
        </Box>
      </HeaderCommentBox>
    );
  },
);

export default CommentHeaderBox;
