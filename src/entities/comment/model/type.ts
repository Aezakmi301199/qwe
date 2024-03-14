export type Comment = {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  isAutoCreated: boolean;
  user: {
    fullName: string;
    avatarUrl: string;
  };
};
