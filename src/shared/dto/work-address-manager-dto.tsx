export type WorkAddressManagerDto = {
  id: string;
  fullName: string;
  riesId: number;
  createdAt: string;
  lastLoginAt: string;
  roleId: string;
  managerId: string;
  workAddressId: number;
  avatarUrl: string;
  isBlocked: boolean;
  blockInitiatorId: string;
  hasStaticRole: boolean;
  telegramId: string | null;
  subscriptionPlanId: string;
  subscriptionPlanExpiresAt: string;
};
