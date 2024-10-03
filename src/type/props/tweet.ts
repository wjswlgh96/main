import { TweetDataType } from "../data/tweet.ts";

export type TweetProps = {
  tweets: TweetDataType;
  setEditId?: React.Dispatch<React.SetStateAction<string>>;
};
