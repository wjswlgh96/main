import { styled } from "styled-components";
import { Column, DeleteButton, EditButton, Photo } from "./tweet-components";
import { TweetType } from "../type/tweet";
import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const Form = styled.form`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const EditPhotoLabel = styled.label`
  width: 100px;
  height: 100px;
  position: absolute;
  text-align: center;
  line-height: 100px;
  top: 0%;
  font-size: 12px;
  font-weight: 600;
  border: 0;
  border-radius: 15px;
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
`;

const EditPhotoInput = styled.input`
  display: none;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

export default function EditTweet({
  id,
  tweet,
  photo,
  editId,
  editInit,
  onCancel,
}: TweetType) {
  const [editTweet, setEditTweet] = useState(tweet);
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user || !editId || editTweet === "" || editTweet.length > 200) return;

    try {
      const data = {
        tweet: editTweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
      };

      await updateDoc(doc(db, "tweets", id), data);

      //   if (file) {
      //     const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
      //     const result = await uploadBytes(locationRef, file);
      //     const url = await getDownloadURL(result.ref);
      //     await updateDoc(doc, {
      //       photo: url,
      //     });
      //   }

      setFile(null);
    } catch (error) {
      console.log(error);
    } finally {
      if (editInit) editInit();
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={200}
        onChange={onChange}
        value={editTweet}
        placeholder="무슨 일이 있으셨나요?"
      />

      <Column className="photo-column">
        {photo ? <Photo src={photo} /> : null}
      </Column>
      <Column style={{ marginTop: "10px" }}>
        <EditButton>수정완료</EditButton>
        <DeleteButton onClick={onCancel}>취소</DeleteButton>
      </Column>
    </Form>
  );
}
