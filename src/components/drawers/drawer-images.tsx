import * as React from 'react';
import { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { observer } from 'mobx-react';
import { DrawerContainer, HeaderCommentBox } from '../../shared/styles/styles';
import { Anchor } from '../../shared/enums/anchor.enum';
import { Box, Stack, Typography } from '@mui/material';
import closeButton from '../../shared/assets/icons/closeModalIcon.svg';
import { FontSize } from '../../shared/enums/font-size.enum';
import { FontWeight } from '../../shared/enums/font-weight.enum';
import { Store } from '../../shared/lib/store';
import { Flat } from '../../entities/real-estate/flat';
import { House } from '../../entities/real-estate/house';
import { Land } from '../../entities/real-estate/land';
import { useRootStore } from '../../root-store.context';
import { theme } from '../../app/providers/theme';
import defaultImage from '../../shared/assets/images/defaultImage.png';
import { fixImage } from '../../shared/lib/fix-image';
import { Domain } from '../../shared/enums/domain.enum';
import { MoveImagePlug } from '../../shared/models/move-image-plug';

type DrawerImagesProps = {
  state: {
    right: boolean;
  };
  onClose: (event: React.MouseEvent | React.KeyboardEvent) => void;
  store: Store<Flat | House | Land>;
  realEstateId: string;
};

const DrawerImages: React.FC<DrawerImagesProps> = observer(({ state, onClose, store, realEstateId }) => {
  const { catalogStore } = useRootStore();
  const domainSource = catalogStore.findDomains();
  const realEstate = store.findById(realEstateId);
  const [urls, setUrls] = useState<{ cdnDomain: string; url: string; domain: string }[]>([]);

  if (!realEstate) {
    return null;
  }

  useEffect(() => {
    const currentDomain = domainSource.find((domainSource) => domainSource.value === realEstate.domain);

    if (!currentDomain) {
      return;
    }

    const data = realEstate.images.map((image: { url: string }) => {
      return {
        cdnDomain: currentDomain.cdnDomains[0],
        url: image.url,
        domain: currentDomain.value,
      };
    });

    setUrls(data);
  }, [domainSource]);

  const list = () => (
    <DrawerContainer role={'presentation'}>
      <HeaderCommentBox>
        <Box>
          <Typography fontSize={FontSize.TWENTY_FOUR_FONT} fontWeight={FontWeight.SEMI_BOLD}>
            Фотографии
          </Typography>
        </Box>
        <Box onClick={onClose}>
          <img className={'closeButton'} alt={''} src={closeButton} />
        </Box>
      </HeaderCommentBox>
      <Stack overflow={'auto'} padding={'24px 24px 20px'} gap={'8px'}>
        {urls.length ? (
          urls.map((image) => (
            <Box key={image.url} position='relative'>
              <img
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '300px',
                  borderRadius: '12px',
                  cursor: 'default',
                  opacity: '0.4',
                  backdropFilter: 'blur(100px)',
                  backgroundImage: `url(${image.cdnDomain}${image.url})`,
                }}
                src={`${image.cdnDomain}${image.url}`}
                onLoad={({ currentTarget }) => {
                  if (
                    image.domain === Domain.MOVE &&
                    currentTarget.naturalWidth === MoveImagePlug.width &&
                    currentTarget.naturalHeight === MoveImagePlug.height
                  ) {
                    currentTarget.src = `${image.cdnDomain}${fixImage(
                      image.url,
                      image.cdnDomain,
                      image.domain,
                      domainSource,
                      setUrls,
                    )}`;
                  }
                }}
                onError={({ currentTarget }) => {
                  currentTarget.src = `${image.cdnDomain}${fixImage(
                    image.url,
                    image.cdnDomain,
                    image.domain,
                    domainSource,
                    setUrls,
                  )}`;
                }}
                rel='noreferrer noopener'
                alt={''}
              />
              <img
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  cursor: 'default',
                  position: 'relative',
                }}
                src={`${image.cdnDomain}${image.url}`}
                onLoad={({ currentTarget }) => {
                  if (
                    image.domain === Domain.MOVE &&
                    currentTarget.naturalWidth === MoveImagePlug.width &&
                    currentTarget.naturalHeight === MoveImagePlug.height
                  ) {
                    currentTarget.src = `${image.cdnDomain}${fixImage(
                      image.url,
                      image.cdnDomain,
                      image.domain,
                      domainSource,
                      setUrls,
                    )}`;
                  }
                }}
                onError={({ currentTarget }) => {
                  currentTarget.src = `${image.cdnDomain}${fixImage(
                    image.url,
                    image.cdnDomain,
                    image.domain,
                    domainSource,
                    setUrls,
                  )}`;
                }}
                rel='noreferrer noopener'
                alt={''}
              />
            </Box>
          ))
        ) : (
          <Box color={theme.palette.text.secondary}>
            <img style={{ cursor: 'default' }} width={'100%'} height={'300px'} src={defaultImage} alt={''} />
          </Box>
        )}
      </Stack>
    </DrawerContainer>
  );

  return (
    <React.Fragment>
      <Drawer
        anchor={Anchor.ANCHOR_RIGHT}
        open={state[Anchor.ANCHOR_RIGHT]}
        hideBackdrop
        sx={{
          width: '450px',
          left: 'calc(100vw - 860px)',
          '.css-10ohwma-MuiPaper-root-MuiDrawer-paper': {
            backgroundColor: 'transparent !important',
            boxShadow: 'none !important',
            right: 'auto !important',
          },
        }}
      >
        {list()}
      </Drawer>
    </React.Fragment>
  );
});

export default DrawerImages;
