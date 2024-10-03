import { styled } from "styled-components";
import { Column, DeleteButton, EditButton, Photo } from "./tweet-components";
import { useState } from "react";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { EditTweetProps } from "../type/props/edittweet";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

export default function EditTweet(props: EditTweetProps) {
  const { tweets, editId, setEditId, onEditCancel } = props;
  const { id, userId, photo, tweet } = tweets;

  const [editTweet, setEditTweet] = useState(tweet);
  const [editPhoto, setEditPhoto] = useState(photo);
  const [isPhotoHover, setIsPhotoHover] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId || !id || editId === "") return;

    const { files } = e.target;

    if (files && files.length === 1) {
      if (files[0].size > 1000000) {
        confirm("1MB 이하의 이미지만 추가가 가능합니다.");
        return;
      }
      const locationRef = ref(storage, `tweets/${userId}/${id}`);
      const result = await uploadBytes(locationRef, files[0]);
      const url = await getDownloadURL(result.ref);

      setFile(files[0]);
      setEditPhoto(url);

      e.currentTarget.value = "";
    }
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

      if (file) {
        await updateDoc(doc(db, "tweets", id), {
          photo: editPhoto,
        });
      }

      setFile(null);
    } catch (error) {
      console.log(error);
    } finally {
      setEditId("");
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
        {photo ? (
          <Column style={{ position: "relative" }}>
            <Photo src={editPhoto} onMouseEnter={() => setIsPhotoHover(true)} />
            <EditPhotoLabel
              style={{ display: isPhotoHover ? "block" : "none" }}
              htmlFor="editFile"
              onMouseLeave={() => setIsPhotoHover(false)}
            >
              사진 수정
            </EditPhotoLabel>
            <EditPhotoInput
              onChange={onFileChange}
              type="file"
              id="editFile"
              accept="image/*"
            />
          </Column>
        ) : null}
      </Column>
      <Column style={{ marginTop: "10px" }}>
        <EditButton>수정완료</EditButton>
        <DeleteButton onClick={onEditCancel}>취소</DeleteButton>
      </Column>
    </Form>
  );
}
