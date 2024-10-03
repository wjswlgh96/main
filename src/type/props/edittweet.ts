import { TweetDataType } from "../data/tweet";

export type EditTweetProps = {
  tweets: TweetDataType;

  editId: string;
  setEditId: React.Dispatch<React.SetStateAction<string>>;
  onEditCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
