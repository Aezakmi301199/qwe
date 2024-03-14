import { environments } from '../../environment';

type getRiesPathUrlResponseTypeData = {
  getRiesUserLink: (userId: number) => string;
  getRiesRealEstateLink: (internalId: number) => string;
};

export const getRiesPathUrl = () => {
  return {
    getRiesUserLink: (userId: number) => `${environments.REACT_APP_RIES_URL}/staff/view/${userId}/`,
    getRiesRealEstateLink: (internalId: number) =>
      `${environments.REACT_APP_RIES_URL}/?page=object&task=view&id=${internalId}`,
  } as getRiesPathUrlResponseTypeData;
};
