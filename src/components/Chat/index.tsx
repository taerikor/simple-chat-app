import React from "react";
import { ChatsState } from "../../routes/Home";
import { doc, deleteDoc } from "@firebase/firestore";
import { dbService, storageService } from "../../firebase";
import { deleteObject, ref } from "firebase/storage";

import timeForToday from "../../utils/Date";
import UserCard from "../UserCard";
import {
  ChatBox,
  ContentWrapper,
  DirectionWrapper,
  Image,
  Wrapper,
  Text,
  Date,
  SideWrapper,
  Delete,
} from "./style";

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
    <>
      <Wrapper>
        <DirectionWrapper isOwner={isOwner}>
          <UserCard authorId={chatObj.authorId} />
        </DirectionWrapper>
        {chatObj.imageUrl && (
          <DirectionWrapper isOwner={isOwner}>
            <Image src={chatObj.imageUrl} alt="post" />
          </DirectionWrapper>
        )}
        <ContentWrapper isOwner={isOwner}>
          <ChatBox isOwner={isOwner}>
            <Text>{chatObj.text}</Text>
          </ChatBox>
          <SideWrapper>
            <Date>{timeForToday(chatObj.createAt)}</Date>
            {isOwner && <Delete onClick={onDeleteClick}>Delete</Delete>}
          </SideWrapper>
        </ContentWrapper>
      </Wrapper>
    </>
  );
};

export default Chat;
