export type TweetType = {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;

  editId?: string;
  editInit?: () => void;
  onIsEdit?: (value: string) => void;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
