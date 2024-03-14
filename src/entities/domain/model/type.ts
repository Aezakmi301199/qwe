import { Script } from '../../../shared/enums/script.enum';
import { ParserDomain } from '../../../shared/enums/parser-domain.enum';

export type DomainSource = {
  name: string;
  value: string;
  scriptName: Script;
  url: ParserDomain;
  logo: string;
  cdnDomains: string[];
};
