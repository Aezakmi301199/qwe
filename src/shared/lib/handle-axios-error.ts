import { HttpStatusCode, isAxiosError } from 'axios';
import { PagePath } from '../enums/page-path';
import { LocalStorageName } from '../enums/local-storage';

export const handleAxiosError = (error: unknown): void => {
  if (!error || !isAxiosError(error)) {
    return;
  }

  const status = error.response?.status;
  const unauthorizedOrForbiddenCodes = [HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden];

  if (!status) {
    return;
  }

  if (unauthorizedOrForbiddenCodes.includes(status)) {
    window.location.href = PagePath.LOGIN;
    localStorage.removeItem(LocalStorageName.IS_SUBSCRIPTION_PLAN_ALERT_CLOSED);

    return;
  }
};
