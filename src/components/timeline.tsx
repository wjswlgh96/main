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

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export default function Timeline({
  setIsEdit,
}: {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [tweets, setTweet] = useState<ITweet[]>([]);
  const [editId, setEditId] = useState("");

  const onIsEdit = (value: string) => {
    setIsEdit(true);
    setEditId(value);
  };

  const editInit = () => {
    setIsEdit(false);
    setEditId("");
  };

  const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    setIsEdit(false);
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
            {...tweet}
            editId={editId}
            editInit={editInit}
            onCancel={onCancel}
          />
        ) : (
          <Tweet key={tweet.id} {...tweet} onIsEdit={onIsEdit} />
        );
      })}
    </Wrapper>
  );
}
