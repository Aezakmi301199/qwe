import React, { useState } from 'react';
import { Stack } from '@mui/material';
import saveIcon from '../../../shared/assets/icons/saveIcon.svg';
import warningIcon from '../../../shared/assets/icons/warningIcon.svg';
import { SaveButton, WarningButton } from '../../../shared/styles/styles';
import SaveObjectModal from '../../modals/save-object-modal';
import { Size } from '../../../shared/enums/size.enum';
import DuplicateObjectModal from '../../modals/duplicate-object-modal';
import { styleDoubleObjectModal } from '../../../shared/styles/modal-styles';
import { Flat } from '../../../entities/real-estate/flat';
import { Store } from '../../../shared/lib/store';
import { House } from '../../../entities/real-estate/house';
import { Land } from '../../../entities/real-estate/land';
import { DealType } from '../../../shared/enums/deal-type.enum';
import { SaveSource } from '../../../shared/enums/save-source.enum';

type ButtonObjectInfoContainerProps = {
  store: Store<Flat | House | Land>;
  realEstate: Flat | House | Land;
};

const ButtonObjectInfoContainer: React.FC<ButtonObjectInfoContainerProps> = ({ store, realEstate }) => {
  const [isOpenObjectInfoModal, setIsOpenObjectInfoModal] = useState<boolean>(false);
  const [isOpenDuplicateModal, setIsOpenDuplicateModal] = useState<boolean>(false);
  const handleSaveRealEstate = async () => {
    store.saveRealEstateEmit(realEstate.id);
  };
  const handleOpenObjectInfoFilter = () => setIsOpenObjectInfoModal(true);
  const handleCloseObjectInfoFilter = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpenObjectInfoModal(false);
  };
  const renderButton = () => {
    return (
      <>
        <SaveButton
          disabled={
            realEstate.dealType === DealType.RENT_SHORT ||
            realEstate.duplicates.some((duplicate) => duplicate.saveSource === SaveSource.PARSER)
          }
          variant={'contained'}
          size={Size.LARGE}
          onClick={handleOpenObjectInfoFilter}
        >
          <img src={saveIcon} alt={''} />
          Сохранить в РИЭС
        </SaveButton>
        <WarningButton onClick={() => setIsOpenDuplicateModal(true)}>
          <img src={warningIcon} alt={''} />
          Дубль
        </WarningButton>
      </>
    );
  };

  return (
    <Stack>
      <Stack padding={'24px'} flexDirection={'row'} gap={'8px'}>
        {renderButton()}
        <SaveObjectModal
          handleSave={handleSaveRealEstate}
          isOpen={isOpenObjectInfoModal}
          onClose={handleCloseObjectInfoFilter}
        />
        <DuplicateObjectModal
          store={store}
          realEstateId={realEstate.id}
          open={isOpenDuplicateModal}
          onClose={() => setIsOpenDuplicateModal(false)}
          style={styleDoubleObjectModal}
        />
      </Stack>
    </Stack>
  );
};

export default ButtonObjectInfoContainer;
