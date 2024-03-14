import { DomainSource } from '../../entities/domain';

export const getDomain = (domain: string, domainSources: DomainSource[]) => {
  const domainSource = domainSources.find((domainSource) => domainSource.value === domain);

  if (!domainSource) {
    return '';
  }

  return domainSource.name;
};
