import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box } from '@mui/material';
import { observer } from 'mobx-react';
import { theme } from '../../../app/providers/theme';
import { Store } from '../../lib/store';
import { Flat } from '../../../entities/real-estate/flat';
import { House } from '../../../entities/real-estate/house';
import { Land } from '../../../entities/real-estate/land';
import defaultImage from '../../assets/images/defaultImage.png';
import { useRootStore } from '../../../root-store.context';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { fixImage } from '../../lib/fix-image';
import { Domain } from '../../enums/domain.enum';
import { MoveImagePlug } from '../../models/move-image-plug';

type SliderProps = {
  width: string;
  marginTop: string;
  marginBottom: string;
  realEstateId: string;
  store: Store<Flat | House | Land>;
  cursor: string;
};

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const SliderComponent: React.FC<SliderProps> = observer(
  ({ width, marginTop, marginBottom, realEstateId, store, cursor }) => {
    const { catalogStore } = useRootStore();
    const domainSource = catalogStore.findDomains();
    const realEstate = store.findById(realEstateId);
    const [urls, setUrls] = useState<{ cdnDomain: string; url: string; domain: string }[]>([]);
    const sliderRef = useRef<Slider | null>(null);
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

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

    const handleSliderNext = () => {
      if (sliderRef.current) {
        sliderRef.current.slickNext();
      }
    };
    const handleSliderPrev = () => {
      if (sliderRef.current) {
        sliderRef.current.slickPrev();
      }
    };
    const onMouseEnterRow = (rowId: string | null) => {
      if (!rowId) {
        return;
      }

      setHoveredRow(rowId);
    };
    const onMouseLeaveRow = () => {
      setHoveredRow(null);
    };

    return (
      <Box
        marginTop={marginTop}
        marginBottom={marginBottom}
        position='relative'
        onMouseEnter={() => onMouseEnterRow(realEstate.id)}
        onMouseLeave={onMouseLeaveRow}
      >
        <Slider {...settings} ref={sliderRef}>
          {urls.length ? (
            urls.map((image) => (
              <Box key={image.url} position='relative'>
                <img
                  style={{
                    position: 'absolute',
                    width: width,
                    height: '200px',
                    borderRadius: '12px',
                    opacity: '0.2',
                    backgroundImage: `url(${image.cdnDomain}${image.url})`,
                  }}
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
                  src={`${image.cdnDomain}${image.url}`}
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
                    width: width,
                    height: '200px',
                    objectFit: 'contain',
                    cursor: cursor,
                    borderRadius: '12px',
                    position: 'relative',
                  }}
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
                  src={`${image.cdnDomain}${image.url}`}
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
            <Box width={width} height={'200px'} color={theme.palette.text.secondary}>
              <img src={defaultImage} alt={''} style={{ width: width, height: '200px', cursor: 'default' }} />
            </Box>
          )}
        </Slider>
        <Box
          display={urls.length > 1 ? 'block' : 'none'}
          visibility={hoveredRow === realEstateId ? 'visible' : 'hidden'}
        >
          <ChevronLeft className='slider-arrow slider-arrow-left' onClick={handleSliderPrev} />
          <ChevronRight className='slider-arrow slider-arrow-right' onClick={handleSliderNext} />
        </Box>
      </Box>
    );
  },
);

export default SliderComponent;
