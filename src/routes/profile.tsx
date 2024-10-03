import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { TweetDataType } from "../type/data/tweet";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const NameColumn = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
`;

const NameForm = styled.form`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
`;

const Name = styled.span`
  font-size: 22px;
`;

const NameEditBtn = styled.button`
  background-color: #1d9bf0;
  border-radius: 5px;
  color: white;
  border: 0;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;

  &:hover {
    opacity: 0.5;
  }
`;

const EditCancelBtn = styled(NameEditBtn)`
  background-color: tomato;
`;

const NameInput = styled.input`
  padding: 5px 10px;
  border: 1px solid #1d9bf0;
  border-radius: 10px;
  outline: 0;
  font-size: 16px;
  font-weight: 500;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<TweetDataType[]>([]);

  const [username, setUserName] = useState(user?.displayName ?? "Anonymous");
  const [isEditName, setIsEditName] = useState(false);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;

    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);

      setAvatar(avatarUrl);
      await updateProfile(user, { photoURL: avatarUrl });
    }
  };

  useEffect(() => {
    const fetchTweets = async () => {
      if (!user) return;

      const tweetQuery = await query(
        collection(db, "tweets"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(25)
      );

      const snapshot = await getDocs(tweetQuery);
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, createdAt, userId, username, photo } = doc.data();

        return {
          id: doc.id,
          tweet,
          createdAt,
          userId,
          username,
          photo,
        };
      });

      setTweets(tweets);
    };

    fetchTweets();
  }, [user, tweets]);

  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const onUserNameChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;
    if (username.length > 10) {
      confirm("이름은 10글자를 넘을 수 없습니다.");
      return;
    }

    try {
      let str = username;
      if (str === "") str = "Anonymous";

      await updateProfile(user, {
        displayName: str,
      });

      setUserName(str);
      setIsEditName(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />

      {isEditName ? (
        <NameColumn>
          <NameForm onSubmit={onUserNameChange}>
            <NameInput
              onChange={onChangeUserName}
              type="text"
              value={username}
            />
            <NameEditBtn>변경하기</NameEditBtn>
            <EditCancelBtn
              onClick={(e) => {
                e.preventDefault();

                setUserName(user?.displayName ?? "Anonymous");
                setIsEditName(false);
              }}
            >
              취소하기
            </EditCancelBtn>
          </NameForm>
        </NameColumn>
      ) : (
        <NameColumn>
          <Name>{username}</Name>
          <NameEditBtn onClick={() => setIsEditName(true)}>
            이름변경
          </NameEditBtn>
        </NameColumn>
      )}

      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweets={tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
