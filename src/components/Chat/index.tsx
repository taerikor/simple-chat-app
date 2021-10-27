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
  margin-top: 6px;
`;
const ChatBox = styled.div<{ isOwner: boolean }>`
  background-color: ${(props) =>
    props.isOwner ? "mediumseagreen" : "#686a68"};
  max-width: 80%;
  padding: 10px 10px;
  margin: 5px 0;
  border-radius: 10px;
`;

const Delete = styled.span`
  padding: 0;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    border-bottom: 1px solid #ffffff;
  }
`;
const SideWrapper = styled.div`
  margin: 8px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Date = styled.span`
  color: #666;
  font-size: 12px;
  margin-bottom: 3px;
`;

const CardWrapper = styled.div<{ isOwner: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isOwner ? "row-reverse" : "row")};
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
  console.log(isOwner);
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
    <>
      <CardWrapper isOwner={isOwner}>
        <UserCard authorId={chatObj.authorId} />
      </CardWrapper>
      <Wrapper isOwner={isOwner}>
        {chatObj.imageUrl && <Image src={chatObj.imageUrl} alt="post" />}
        <ChatBox isOwner={isOwner}>
          <h3>{chatObj.text}</h3>
        </ChatBox>
        <SideWrapper>
          <Date>{timeForToday(chatObj.createAt)}</Date>
          {isOwner && <Delete onClick={onDeleteClick}>Delete</Delete>}
        </SideWrapper>
      </Wrapper>
    </>
  );
};

export default Chat;
