import { Anchor } from '../../../shared/enums/anchor.enum';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { formatISODate } from '../../../shared/lib/convert-timestamp-to-dateTime';
import CommentHeaderBox from '../../../components/containers/drawer-comment/comment-header-box';
import CommentChatBox from '../../../components/containers/drawer-comment/comment-chat-box';
import CommentContainerBox from '../../../components/containers/drawer-comment/comment-container-box';
import { CommentBoxContainer, DrawerContainer } from '../../../shared/styles/styles';
import { observer } from 'mobx-react';
import { Store } from '../../../shared/lib/store';
import { Flat } from '../../real-estate/flat';
import { House } from '../../real-estate/house';
import { Land } from '../../real-estate/land';
import { InitialState, PageLimit } from '../../../shared/enums/pagination.enum';
import { Box } from '@mui/material';
import { PageNumber } from '../../../shared/enums/page-number';

type CommentDrawerProps = {
  store: Store<Flat | House | Land>;
  realEstateId: string;
  primaryText?: string;
  secondaryText?: string;
  state: {
    right: boolean;
  };
  hideBackdrop: boolean;
  showHeader: boolean;
  isFromCallInfoDrawer: boolean;
  setOpenedDrawerCommentId: (id: string | null) => void;
  onClose?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  commentCount: number;
};

export const CommentDrawer: React.FC<CommentDrawerProps> = observer(
  ({
    realEstateId,
    state,
    setOpenedDrawerCommentId,
    hideBackdrop,
    showHeader,
    isFromCallInfoDrawer,
    primaryText,
    secondaryText,
    store,
    onClose,
    commentCount,
  }) => {
    const [comment, setComment] = useState('');
    const commentContainerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState<number>(PageNumber.FIRST);

    const handleClickAdd = async () => {
      if (!commentContainerRef.current) {
        return;
      }

      const currentComment = comment.trim();

      if (!currentComment.length) {
        setComment(currentComment);

        return;
      }

      store.addCommentEmit(realEstateId, currentComment);
      setComment('');
    };

    useEffect(() => {
      store.fetchComments(realEstateId, currentPage, commentCount);
    }, [currentPage]);

    const handleScroll = (commentCount: number) => {
      const container = commentContainerRef.current;
      const isLastPage: boolean = Math.ceil(commentCount / PageLimit.FIFTEEN) === currentPage;

      if (container) {
        const scrollTop = container.scrollTop;

        if (scrollTop === 0 && !isLastPage) {
          setCurrentPage((prevPage) => ++prevPage);
        }
      }
    };

    const list = () => (
      <DrawerContainer role={'presentation'}>
        <CommentHeaderBox
          onClose={onClose}
          store={store}
          primaryText={primaryText}
          secondaryText={secondaryText}
          setOpenedDrawerCommentId={setOpenedDrawerCommentId}
          showHeader={showHeader}
        />
        <CommentBoxContainer ref={commentContainerRef} onScroll={() => handleScroll(commentCount)}>
          {store.comments.map((comment) => (
            <CommentContainerBox
              key={comment.id}
              name={comment.user.fullName}
              date={formatISODate(comment.createdAt)}
              comment={comment.text}
              avatarUrl={`${comment.user.avatarUrl}`}
            />
          ))}
        </CommentBoxContainer>
        <CommentChatBox comment={comment} sendComment={handleClickAdd} setComment={setComment} />
      </DrawerContainer>
    );

    return (
      <React.Fragment>
        <Drawer
          anchor={Anchor.ANCHOR_RIGHT}
          open={state[Anchor.ANCHOR_RIGHT]}
          hideBackdrop={hideBackdrop}
          sx={{
            width: '450px',
            left: isFromCallInfoDrawer ? 'calc(100vw - 860px)' : 'none',
            '.css-10ohwma-MuiPaper-root-MuiDrawer-paper': {
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
              right: isFromCallInfoDrawer ? 'auto !important' : 'none',
            },
          }}
        >
          {list()}
        </Drawer>
      </React.Fragment>
    );
  },
);
