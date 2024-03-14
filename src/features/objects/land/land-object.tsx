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
import { Box, Divider } from '@mui/material';
import { BorderLinearProgress } from '../../../shared/ui-kit/progress/border-linear-progress';
import DrawerMap from '../../../components/drawers/drawer-map';
import NoDataNotification from '../../../shared/ui-kit/no-data-notification/no-data-notification';
import { NoDataMessage } from '../../../shared/enums/no-data-message-enum';
import LandObjectTable from './land-object-table';
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

const LandObject: React.FC<TabPanelProps> = observer(({ value, index }) => {
  const { landStore, crmLandStore, catalogStore } = useRootStore();
  const user = useUser();
  const [openedCommentDrawerId, setOpenedCommentDrawerId] = useState<string | null>(null);
  const [isOpenCopySnackbar, setIsOpenCopySnackbar] = useState<boolean>(false);
  const [openedMapDrawerId, setOpenedMapDrawerId] = useState<string | null>(null);
  const landId = openedCommentDrawerId || openedMapDrawerId;
  const fetchWithDebounce = debounce(
    async () => crmLandStore.fetchCrmRealEstate(user.id),
    500 * TimeConvert.MILLISECONDS_IN_MILLISECONDS,
  );

  useEffect(() => {
    catalogStore.fetchCrmStatuses();
    crmLandStore.setLoadingRealEstate(true);
    fetchWithDebounce();
  }, [crmLandStore.filter]);

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
        if (realEstateId === landId) {
          landStore.addComment({
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

        crmLandStore.incrementCrmCommentCount(realEstateId);
      },
    );

  let crmLand = null;

  if (landId) {
    crmLand = crmLandStore.findCrmRealEstateById(landId);
  }

  return (
    <>
      {openedMapDrawerId && crmLand && (
        <DrawerMap
          setOpenedMapDrawerId={setOpenedMapDrawerId}
          state={{ right: true }}
          coordinates={{ latitude: crmLand.latitude, longitude: crmLand.longitude }}
        />
      )}
      <SnackbarToast
        handleCloseSnackBar={() => setIsOpenCopySnackbar(false)}
        isOpenSnackBar={isOpenCopySnackbar}
        message={SnackbarMessage.COPY_CODE}
      />
      {openedCommentDrawerId && crmLand && (
        <CommentDrawer
          commentCount={crmLand.lands[0].land._count.comments}
          store={landStore}
          realEstateId={openedCommentDrawerId}
          primaryText={getCommentTitle(RealEstateType.LANDS, crmLand.lands[0].land)}
          secondaryText={`${
            crmLand.price
              ? `${formatPrice(crmLand.price || null)} ${CurrencySymbol[crmLand.lands[0].land.currency]}`
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
        <BorderLinearProgress visible={crmLandStore.loading} />
      </Box>
      <ToolbarContainer>
        <CrmStatusSelect statuses={catalogStore.findCrmStatuses()} crmRealEstateStore={crmLandStore} />
      </ToolbarContainer>
      <>
        {crmLandStore.loading ? null : crmLandStore.crmRealEstate.length ? (
          <>
            <Divider orientation='horizontal' sx={{ marginTop: '16px', marginLeft: '24px' }} />
            <LandObjectTable
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
                crmLandStore.isErrorData
                  ? NoDataMessage.NO_DATA_LOADED
                  : crmLandStore.filter.crmRealEstateStatus
                    ? NoDataMessage.NO_DATA_FOUND
                    : NoDataMessage.SAVE_OBJECT_RIES
              }
              descriptionSecondary={
                crmLandStore.isErrorData
                  ? NoDataMessage.REFRESH_PAGE
                  : crmLandStore.filter.crmRealEstateStatus
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

export default LandObject;
