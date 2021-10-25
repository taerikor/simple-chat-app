import React from "react";
import { ChatsState } from "../../routes/Home";
import { doc, deleteDoc } from "@firebase/firestore";
import { dbService, storageService } from "../../firebase";
import { deleteObject, ref } from "firebase/storage";

import timeForToday from "../../utils/Date";
import UserCard from "../UserCard";
import styled from "styled-components";

const Wrapper = styled.div<{ isOwner: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isOwner ? "row-reverse" : "row")};
  margin-bottom: 20px;
`;
const ChatBox = styled.div<{ isOwner: boolean }>`
  background-color: ${(props) => (props.isOwner ? "#3bf52a" : "#686a68")};
  max-width: 80%;
  padding: 0px 20px;
  margin: 5px 10px;
  border-radius: 10px;
`;

const Delete = styled.span`
  cursor: pointer;
  &:hover {
    border-bottom: 1px solid #ffffff;
  }
`;

const Image = styled.img`
  height: 80px;
  width: 80px;
`;
interface ChatProps {
  chatObj: ChatsState;
  isOwner: boolean;
}

const Chat: React.FunctionComponent<ChatProps> = ({ chatObj, isOwner }) => {
  const onDeleteClick = async () => {
    const confirm = window.confirm("you really delete this?");
    if (confirm) {
      await deleteDoc(doc(dbService, `chats/${chatObj.id}`));
      if (chatObj.imageUrl) {
        await deleteObject(ref(storageService, chatObj.imageUrl));
      }
    }
  };

  return (
    <Wrapper isOwner={isOwner}>
      {chatObj.imageUrl && <Image src={chatObj.imageUrl} alt="post" />}
      <UserCard authorId={chatObj.authorId} />
      <ChatBox isOwner={isOwner}>
        <h3>{chatObj.text}</h3>
      </ChatBox>
      <div>
        <p>{timeForToday(chatObj.createAt)}</p>
        {isOwner && <Delete onClick={onDeleteClick}>Delete</Delete>}
      </div>
    </Wrapper>
  );
};

export default Chat;
