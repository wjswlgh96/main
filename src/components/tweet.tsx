import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import {
  Column,
  DeleteButton,
  EditButton,
  Payload,
  Photo,
  Username,
  Wrapper,
} from "./tweet-components";
import { TweetProps } from "../type/props/tweet";

export default function Tweet(props: TweetProps) {
  const { tweets, setEditId } = props;
  const { id, userId, username, photo, tweet } = tweets;

  const user = auth.currentUser;

  const onDelete = async () => {
    const ok = confirm("정말 이 트윗을 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (error) {
      console.log(error);
    } finally {
      //
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? (
          <EditButton
            onClick={() => {
              setEditId(id);
            }}
          >
            수정하기
          </EditButton>
        ) : null}
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>삭제하기</DeleteButton>
        ) : null}
      </Column>
      <Column className="photo-column">
        {photo ? <Photo src={photo} /> : null}
      </Column>
    </Wrapper>
  );
}
