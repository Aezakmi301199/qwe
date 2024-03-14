import { ParserDefaultAuthorName } from '../enums/parser-default-author-name';
import { Author } from '../enums/author.enum';

interface getClientNameByAuthorArgs {
  author: Author | null;
  clientName: string | null;
  textError?: string;
}

export const getClientNameByAuthor = ({ author, clientName, textError = 'Не указан' }: getClientNameByAuthorArgs) => {
  if (!author || !clientName) {
    return textError;
  }

  if (author === Author.AGENCY) {
    return getAgencyName(clientName);
  }

  if (author === Author.OWNER) {
    return ParserDefaultAuthorName.OWNER;
  }

  return clientName;
};

const getAgencyName = (name: string | null) => {
  return name ? name : ParserDefaultAuthorName.AGENCY;
};
