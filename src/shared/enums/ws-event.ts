export enum WsEvent {
  MAKE_CALL = 'makeCall',
  CALL_STARTED = 'callStarted',
  CALL_ENDED = 'callEnded',
  EXCEPTION = 'exception',
  CLIENT_DISCONNECTED = 'clientDisconnected',
  CHANGE_STATUS = 'changeStatus',
  STATUS_CHANGED = 'statusChanged',
  ADD_DUPLICATE = 'addDuplicate',
  DUPLICATE_ADDED = 'duplicateAdded',
  SAVE_REAL_ESTATE = 'saveRealEstate',
  REAL_ESTATE_SAVED = 'realEstateSaved',
  ADD_COMMENT = 'addComment',
  COMMENT_ADDED = 'commentAdded',
  GET_PHONE = 'getPhone',
  NEW_PHONE = 'newPhone',
  PAYMENT_COMPLETED = 'paymentCompleted',
}