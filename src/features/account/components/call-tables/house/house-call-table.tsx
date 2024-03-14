import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRootStore } from '../../../../../root-store.context';
import { InitialState, PageLimit } from '../../../../../shared/enums/pagination.enum';
import {
  Box,
  Button,
  Link,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { formatISODate, formatTime } from '../../../../../shared/lib/convert-timestamp-to-dateTime';
import { AccessTime, Notes, PauseCircleFilledRounded, PlayCircleFilledRounded } from '@mui/icons-material';
import { theme } from '../../../../../app/providers/theme';
import { FontSize } from '../../../../../shared/enums/font-size.enum';
import { observer } from 'mobx-react';
import DrawerObjectInfo from '../../../../../components/drawers/drawer-object-info';
import { RealEstateType } from '../../../../../shared/enums/real-estate-type.enum';
import { SocketContext } from '../../../../../socket';
import { WsEvent } from '../../../../../shared/enums/ws-event';
import { CallData } from '../../../../../shared/types/call-data';
import SnackbarNotify from '../../../../../shared/ui-kit/snackbar/snackbar-shared';
import { SnackbarMessage } from '../../../../../shared/enums/snackbar-message';
import { environments } from '../../../../../environment';
import { RecognitionStatus } from '../../../../../shared/enums/recognition-status.enum';
import { StatusChip } from '../../../ui/ui';
import DrawerRecognition from '../../../../../components/drawers/drawer-recognition';
import { useUser } from '../../../../../user-context';
import { MainTableCallContainer } from '../../../../../shared/styles/styles';
import NoDataNotification from '../../../../../shared/ui-kit/no-data-notification/no-data-notification';
import { NoDataMessage } from '../../../../../shared/enums/no-data-message-enum';

const HouseCallTable = observer(() => {
  const { houseCallStore, houseStore, catalogStore } = useRootStore();
  const [openedMakeCallDrawerId, setOpenedMakeCallDrawerId] = useState<string | null>(null);
  const [openedRecognizedDrawerId, setOpenedRecognizedDrawerId] = useState<string | null>(null);
  const [openedCommentDrawerId, setOpenedCommentDrawerId] = useState<string | null>(null);
  const [isMySaveCrm, setIsMySaveCrm] = useState<boolean>(false);
  const [isMyDuplicate, setIsMyDuplicate] = useState<boolean>(false);
  const [isOpenSaveCRMSnackbar, setIsOpenSaveCRMSnackbar] = useState<boolean>(false);
  const [isOpenDuplicateSnackbar, setIsOpenDuplicateSnackbar] = useState<boolean>(false);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const timeRefs = useRef<Record<string, { duration: number }>>({});
  const [playbackState, setPlaybackState] = useState<Record<string, boolean>>({ playbackState: false });
  const [currentTime, setCurrentTime] = useState<Record<string, number>>({ currentTime: InitialState.ZERO });
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const user = useUser();
  const isDefaultUser = user.subscriptionPlan.isDefault;

  useEffect(() => {
    houseCallStore.fetchCalls(user.id);
    houseCallStore.fetchCallsCount(user.id);
  }, [houseCallStore.page]);

  const togglePlay = (id: string) => {
    if (activeCallId && activeCallId !== id) {
      const activeAudioRef = audioRefs.current[activeCallId];

      activeAudioRef.pause();
      setPlaybackState((prevState) => ({ ...prevState, [activeCallId]: false }));
    }

    const audioRef = audioRefs.current[id];

    if (!audioRef) {
      return;
    }

    const isPlaying = !playbackState[id];

    isPlaying ? audioRef.play() : audioRef.pause();

    setPlaybackState((prevState) => ({
      ...prevState,
      [id]: isPlaying,
    }));

    setActiveCallId(isPlaying ? id : null);
  };

  const handleTimeUpdate = (id: string) => {
    const audioRef = audioRefs.current[id];
    const currentTime = audioRef.currentTime;
    const duration = audioRef.duration;

    setCurrentTime({ currentTime, [id]: currentTime });
    timeRefs.current[id] = { duration };
  };

  const handleLoadedMetadata = (id: string) => {
    const audioRef = audioRefs.current[id];
    const duration = audioRef.duration;

    timeRefs.current[id] = { duration };
  };

  const handleSeek = (id: string, newValue: number | number[]) => {
    const audioRef = audioRefs.current[id];
    const currentTime = Array.isArray(newValue) ? newValue[0] : newValue;

    audioRef.currentTime = currentTime;

    setCurrentTime({ currentTime, [id]: currentTime });
  };

  const handleEnded = (id: string) => {
    setPlaybackState({ ...playbackState, [id]: false });
    setCurrentTime({ ...currentTime, [id]: InitialState.ZERO });
  };

  const getElementById = async (id: string) => {
    await houseStore.fetchByIdFromApi(id);
  };
  const socket = useContext(SocketContext);

  socket
    .off(WsEvent.STATUS_CHANGED)
    .on(
      WsEvent.STATUS_CHANGED,
      ({
        realEstateId,
        statusId,
        commentText,
        commentId,
        userId,
        userFullName,
        userAvatarUrl,
      }: {
        realEstateId: string;
        statusId: string | null;
        commentText: string;
        commentId: string;
        userId: string;
        userFullName: string;
        userAvatarUrl: string;
      }) => {
        houseStore.changeStatus(realEstateId, statusId, user.id);

        if (!statusId) {
          return;
        }

        houseStore.addComment({
          createdAt: new Date().toISOString(),
          id: commentId,
          isAutoCreated: true,
          text: commentText,
          updatedAt: new Date().toISOString(),
          user: {
            avatarUrl: userAvatarUrl,
            fullName: userFullName,
          },
          userId: userId,
        });
        houseStore.incrementCommentCount(realEstateId);
      },
    );
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
        if (realEstateId === openedMakeCallDrawerId) {
          houseStore.addComment({
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

        houseStore.incrementCommentCount(realEstateId);
      },
    );
  socket
    .off(WsEvent.CALL_STARTED)
    .on(WsEvent.CALL_STARTED, ({ userId, avatarUrl, fullName, realEstateId }: CallData) => {
      houseStore.reserveForCall({
        realEstateId: realEstateId,
        userId,
        avatarUrl,
        fullName,
      });
    });
  socket.off(WsEvent.CALL_ENDED).on(WsEvent.CALL_ENDED, ({ realEstateId }: { realEstateId: string }) => {
    houseStore.cancelReservationForCall(realEstateId);
  });
  socket.off(WsEvent.CLIENT_DISCONNECTED).on(WsEvent.CLIENT_DISCONNECTED, ({ userId }: { userId: string }) => {
    houseStore.handleDisconnect(userId);
  });
  socket
    .off(WsEvent.REAL_ESTATE_SAVED)
    .on(WsEvent.REAL_ESTATE_SAVED, ({ realEstateId, userId }: { realEstateId: string; userId: string }) => {
      if (openedCommentDrawerId === realEstateId || openedMakeCallDrawerId === realEstateId) {
        handleOpenOtherSaveCrmSnackbar();

        setOpenedMakeCallDrawerId(null);
        setOpenedCommentDrawerId(null);
      }

      if (user.id === userId) {
        handleOpenMySaveCrmSnackbar();
      }

      houseStore.removeById(realEstateId);
    });
  socket
    .off(WsEvent.DUPLICATE_ADDED)
    .on(WsEvent.DUPLICATE_ADDED, ({ realEstateId, userId }: { realEstateId: string; userId: string }) => {
      if (openedMakeCallDrawerId === realEstateId || openedMakeCallDrawerId === realEstateId) {
        handleOpenOtherDuplicateSnackbar();

        setOpenedMakeCallDrawerId(null);
        setOpenedCommentDrawerId(null);
      }

      if (userId === user.id) {
        handleOpenMyDuplicateSnackbar();
      }

      houseStore.removeById(realEstateId);
    });

  const handleOpenMySaveCrmSnackbar = () => {
    setIsMySaveCrm(true);
    setIsOpenSaveCRMSnackbar(true);
  };

  const handleOpenOtherSaveCrmSnackbar = () => {
    setIsMySaveCrm(false);
    setIsOpenSaveCRMSnackbar(true);
  };

  const handleOpenMyDuplicateSnackbar = () => {
    setIsMyDuplicate(true);
    setIsOpenDuplicateSnackbar(true);
  };

  const handleOpenOtherDuplicateSnackbar = () => {
    setIsMyDuplicate(false);
    setIsOpenDuplicateSnackbar(true);
  };

  return (
    <>
      <MainTableCallContainer
        sx={{ height: `${user.subscriptionPlan.isDefault ? 'calc(100dvh - 375px)' : 'calc(100dvh - 300px)'}` }}
      >
        {houseCallStore.realEstateCalls.length ? (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width={'150px'} align={'left'}>
                  Дата
                </TableCell>
                <TableCell width={'58px'} align={'left'}>
                  Объект
                </TableCell>
                <TableCell align={'left'} sx={{ maxWidth: '320px' }}>
                  Запись
                </TableCell>
                <TableCell width={'128px'} align={'left'}>
                  Текст
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {houseCallStore.realEstateCalls.map((call) => {
                const id = call.id;
                const isPlaying = playbackState[id];
                const currentTimeForItem = currentTime[id] || InitialState.ZERO;
                const duration = timeRefs.current[id]?.duration || InitialState.ZERO;

                return (
                  <TableRow key={id}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatISODate(call.createdAt)}</TableCell>
                    <TableCell
                      onClick={async () => {
                        await getElementById(call.house.id);
                        setOpenedMakeCallDrawerId(call.house.id);
                        setOpenedCommentDrawerId(call.house.id);
                      }}
                    >
                      <Link sx={{ textDecoration: 'none' }}>Объект</Link>
                    </TableCell>
                    <TableCell>
                      <Stack direction='row' alignItems='flex-start' gap='16px'>
                        {isPlaying ? (
                          <PauseCircleFilledRounded
                            onClick={() => togglePlay(call.id)}
                            sx={{
                              width: '35px',
                              height: '35px',
                              color: theme.palette.primary.main,
                              cursor:
                                call.recognitionStatus !== RecognitionStatus.DONE || !call.url ? 'default' : 'pointer',
                            }}
                          />
                        ) : (
                          <PlayCircleFilledRounded
                            onClick={!call.url ? undefined : () => togglePlay(call.id)}
                            sx={{
                              width: '35px',
                              height: '35px',
                              color: !call.url ? 'gray' : theme.palette.primary.main,
                              cursor: !call.url ? 'default' : 'pointer',
                            }}
                          />
                        )}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <Typography
                            fontSize={FontSize.FOURTEENTH_FONT}
                            color={theme.palette.text.primary}
                            width={'262px'}
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {call.house.address ? call.house.address : 'Адрес не указан'}
                          </Typography>
                          <audio
                            ref={(ref) => {
                              if (ref) {
                                audioRefs.current[id] = ref;
                              }
                            }}
                            src={`${environments.REACT_APP_SAFE_WAY}${call.url}`}
                            onTimeUpdate={() => handleTimeUpdate(id)}
                            onLoadedMetadata={() => handleLoadedMetadata(id)}
                            onEnded={() => handleEnded(id)}
                          />
                          <Slider
                            value={currentTimeForItem}
                            onChange={(e, newValue) => handleSeek(id, newValue)}
                            max={duration}
                            sx={{ width: '100px' }}
                          />
                        </Box>
                        <Typography
                          fontSize={FontSize.FOURTEENTH_FONT}
                          color={theme.palette.text.primary}
                          alignSelf={'center'}
                        >
                          {formatTime(call.duration)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <>
                        {call.recognitionStatus === RecognitionStatus.DONE && (
                          <Button
                            onClick={async () => {
                              await getElementById(call.house.id);
                              setOpenedRecognizedDrawerId(call.house.id);
                            }}
                            variant={'outlined'}
                            sx={{
                              borderRadius: '8px',
                              textTransform: 'none',
                              whiteSpace: 'nowrap',
                              gap: '8px',
                              fontSize: '13px',
                              height: '30px',
                            }}
                          >
                            <Notes />
                            Текст диалога
                          </Button>
                        )}
                        {(call.recognitionStatus === RecognitionStatus.FAILED || !call.recognitionStatus) && (
                          <StatusChip label='Обрабатывается' icon={<AccessTime className={'recognitionStatus'} />} />
                        )}
                        {call.recognitionStatus === RecognitionStatus.PROCESSING && (
                          <StatusChip label='Распознается' icon={<Notes className={'recognitionStatus'} />} />
                        )}
                      </>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            {openedMakeCallDrawerId && houseStore.realEstate && (
              <DrawerObjectInfo
                store={houseStore}
                route={RealEstateType.HOUSES}
                statuses={catalogStore.findStatuses()}
                realEstateId={openedMakeCallDrawerId}
                setOpenedDrawer={setOpenedMakeCallDrawerId}
                state={{ right: true }}
              />
            )}
            {openedRecognizedDrawerId && houseStore.realEstate && (
              <DrawerRecognition
                isDefaultUser={isDefaultUser}
                store={houseStore}
                route={RealEstateType.HOUSES}
                realEstateId={openedRecognizedDrawerId}
                setOpenedDrawer={setOpenedRecognizedDrawerId}
                state={{ right: true }}
                text={houseCallStore.realEstateCalls
                  .find((call) => call.house.id === openedRecognizedDrawerId)
                  ?.recognizedText.map((text) => text)}
              />
            )}
            <SnackbarNotify
              message={isMySaveCrm ? SnackbarMessage.MY_SAVE_RIES : SnackbarMessage.OTHER_SAVE_RIES}
              isOpenSnackBar={isOpenSaveCRMSnackbar}
              handleCloseSnackBar={() => setIsOpenSaveCRMSnackbar(false)}
            />
            <SnackbarNotify
              message={isMyDuplicate ? SnackbarMessage.MY_DUPLICATE : SnackbarMessage.OTHER_DUPLICATE}
              isOpenSnackBar={isOpenDuplicateSnackbar}
              handleCloseSnackBar={() => setIsOpenDuplicateSnackbar(false)}
            />
          </Table>
        ) : (
          <NoDataNotification descriptionPrimary={NoDataMessage.NO_DATA_CALLS} descriptionSecondary={''} />
        )}
      </MainTableCallContainer>
      <TablePagination
        component='div'
        count={houseCallStore.realEstateCallsCount}
        page={houseCallStore.page - 1}
        onPageChange={(_, newPage) => houseCallStore.setPage(newPage + 1)}
        rowsPerPage={PageLimit.FIFTEEN}
        rowsPerPageOptions={[PageLimit.FIFTEEN]}
        sx={{ borderTop: '1px solid #E0E0E0' }}
      />
    </>
  );
});

export default HouseCallTable;
