import React from 'react';
import { EventKey } from '../enums/event-key.enum';

export const catchEnterKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, func: () => void) => {
  if (event.key !== EventKey.ENTER) {
    return;
  }

  event.preventDefault();
  func();
};
