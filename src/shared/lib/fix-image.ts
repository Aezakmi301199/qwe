import { DomainSource } from '../../entities/domain';
import React from 'react';

export const fixImage = (
  url: string,
  cdnDomain: string,
  domain: string,
  domainSource: DomainSource[],
  setUrls: React.Dispatch<React.SetStateAction<{ cdnDomain: string; url: string; domain: string }[]>>,
): string => {
  setUrls((prevUrls: { cdnDomain: string; url: string; domain: string }[]) => {
    const newUrls = prevUrls.filter((imageEntry) => imageEntry.url !== url);
    const cdnDomains = domainSource.find((domainSource) => domainSource.value === domain)?.cdnDomains;

    if (!cdnDomains) {
      return newUrls;
    }

    const currentDomainIndex = cdnDomains.findIndex((entry) => entry === cdnDomain);

    if (cdnDomains[currentDomainIndex + 1]) {
      newUrls.push({ domain, cdnDomain: cdnDomains[currentDomainIndex + 1], url });
    }

    return newUrls;
  });

  return url;
};
