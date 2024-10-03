import {
  collection,
  /*  getDocs, */
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";
import EditTweet from "./edittweet";
import { TweetDataType } from "../type/data/tweet";
import { TimeLineProps } from "../type/props/timeline";

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export default function Timeline(props: TimeLineProps) {
  const { editId, setEditId } = props;
  const [tweets, setTweet] = useState<TweetDataType[]>([]);

  const onEditCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    setEditId("");
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweet(tweets);
      });
    };

    fetchTweets();
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => {
        return editId === tweet.id ? (
          <EditTweet
            key={tweet.id}
            tweets={tweet}
            editId={editId}
            setEditId={setEditId}
            onEditCancel={onEditCancel}
          />
        ) : (
          <Tweet key={tweet.id} tweets={tweet} setEditId={setEditId} />
        );
      })}
    </Wrapper>
  );
}
