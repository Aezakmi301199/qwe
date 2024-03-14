import React, { useContext, useEffect, useState } from 'react';
import { useRootStore } from '../../../root-store.context';
import { observer } from 'mobx-react';
import { CurrencySymbol } from '../../../shared/enums/currency-symbol.enum';
import { formatPrice } from '../../../shared/lib/format-price-number';
import { SnackbarMessage } from '../../../shared/enums/snackbar-message';
import SnackbarToast from '../../../shared/ui-kit/snackbar/snackbar-copy-id';
import { CommentDrawer } from '../../../entities/comment';
import { getCommentTitle } from '../../grid/lib/get-comment-title';
import { RealEstateType } from '../../../shared/enums/real-estate-type.enum';
import { WsEvent } from '../../../shared/enums/ws-event';
import FlatObjectTable from './flat-object-table';
import { Box, Divider } from '@mui/material';
import { BorderLinearProgress } from '../../../shared/ui-kit/progress/border-linear-progress';
import DrawerMap from '../../../components/drawers/drawer-map';
import NoDataNotification from '../../../shared/ui-kit/no-data-notification/no-data-notification';
import { NoDataMessage } from '../../../shared/enums/no-data-message-enum';
import { CrmStatusSelect } from '../../../entities/crm-status';
import { ToolbarContainer } from '../../../shared/styles/styles';
import { debounce } from 'lodash';
import { TimeConvert } from '../../../shared/enums/time-convert.enum';
import { useUser } from '../../../user-context';
import { SocketContext } from '../../../socket';

interface TabPanelProps {
  index: number;
  value: number;
}

const FlatObject: React.FC<TabPanelProps> = observer(({ value, index }) => {
  const { flatStore, crmFlatStore, catalogStore } = useRootStore();
  const user = useUser();
  const [openedCommentDrawerId, setOpenedCommentDrawerId] = useState<string | null>(null);
  const [isOpenCopySnackbar, setIsOpenCopySnackbar] = useState<boolean>(false);
  const [openedMapDrawerId, setOpenedMapDrawerId] = useState<string | null>(null);
  const flatId = openedCommentDrawerId || openedMapDrawerId;
  const fetchWithDebounce = debounce(
    async () => crmFlatStore.fetchCrmRealEstate(user.id),
    500 * TimeConvert.MILLISECONDS_IN_MILLISECONDS,
  );

  useEffect(() => {
    catalogStore.fetchCrmStatuses();
    crmFlatStore.setLoadingRealEstate(true);
    fetchWithDebounce();
  }, [crmFlatStore.filter]);

  const socket = useContext(SocketContext);

  socket
    .off(WsEvent.COMMENT_ADDED)
    .on(
      WsEvent.COMMENT_ADDED,
      ({
        userId,
        userFullName,
        userAvatarUrl,
        text,
        realEstateId,
        commentId,
      }: {
        userId: string;
        userFullName: string;
        userAvatarUrl: string;
        realEstateId: string;
        text: string;
        commentId: string;
      }) => {
        if (realEstateId === flatId) {
          flatStore.addComment({
            createdAt: new Date().toISOString(),
            id: commentId,
            isAutoCreated: false,
            text: text,
            updatedAt: new Date().toISOString(),
            user: {
              avatarUrl: userAvatarUrl,
              fullName: userFullName,
            },
            userId: userId,
          });
        }

        crmFlatStore.incrementCrmCommentCount(realEstateId);
      },
    );

  let crmFlat = null;

  if (flatId) {
    crmFlat = crmFlatStore.findCrmRealEstateById(flatId);
  }

  return (
    <>
      {openedMapDrawerId && crmFlat && (
        <DrawerMap
          setOpenedMapDrawerId={setOpenedMapDrawerId}
          state={{ right: true }}
          coordinates={{ latitude: crmFlat.latitude, longitude: crmFlat.longitude }}
        />
      )}
      <SnackbarToast
        handleCloseSnackBar={() => setIsOpenCopySnackbar(false)}
        isOpenSnackBar={isOpenCopySnackbar}
        message={SnackbarMessage.COPY_CODE}
      />
      {openedCommentDrawerId && crmFlat && (
        <CommentDrawer
          commentCount={crmFlat.flats[0].flat._count.comments}
          store={flatStore}
          realEstateId={openedCommentDrawerId}
          primaryText={getCommentTitle(RealEstateType.FLATS, crmFlat.flats[0].flat)}
          secondaryText={`${
            crmFlat?.price
              ? `${formatPrice(crmFlat?.price || null)} ${CurrencySymbol[crmFlat.flats[0].flat.currency]}`
              : 'Не указана'
          }`}
          state={{ right: true }}
          setOpenedDrawerCommentId={setOpenedCommentDrawerId}
          hideBackdrop={false}
          showHeader={true}
          isFromCallInfoDrawer={false}
        />
      )}
      <Box sx={{ width: '100%' }}>
        <BorderLinearProgress visible={crmFlatStore.loading} />
      </Box>
      <ToolbarContainer>
        <CrmStatusSelect statuses={catalogStore.findCrmStatuses()} crmRealEstateStore={crmFlatStore} />
      </ToolbarContainer>
      <>
        {crmFlatStore.loading ? null : crmFlatStore.crmRealEstate.length ? (
          <>
            <Divider orientation='horizontal' sx={{ marginTop: '16px', marginLeft: '24px', marginRight: '24px' }} />
            <FlatObjectTable
              value={value}
              index={index}
              setOpenedCommentDrawerId={setOpenedCommentDrawerId}
              setOpenedMapDrawerId={setOpenedMapDrawerId}
              setIsOpenCopySnackbar={setIsOpenCopySnackbar}
            />
          </>
        ) : (
          <Box sx={{ marginLeft: '24px' }}>
            <NoDataNotification
              descriptionPrimary={
                crmFlatStore.isErrorData
                  ? NoDataMessage.NO_DATA_LOADED
                  : crmFlatStore.filter.crmRealEstateStatus
                    ? NoDataMessage.NO_DATA_FOUND
                    : NoDataMessage.SAVE_OBJECT_RIES
              }
              descriptionSecondary={
                crmFlatStore.isErrorData
                  ? NoDataMessage.REFRESH_PAGE
                  : crmFlatStore.filter.crmRealEstateStatus
                    ? NoDataMessage.CHANGE_SEARCH_PARAMS
                    : NoDataMessage.SAVE_OBJECT_RIES_DESCRIPTION
              }
            />
          </Box>
        )}
      </>
    </>
  );
});

export default FlatObject;
