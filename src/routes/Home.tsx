import React, { useEffect, useState } from "react";
import { dbService } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Chat from "../components/Chat";
import ChatForm from "../components/ChatForm";
import { userObjState } from "../components/App";
import styled from "styled-components";

export interface ChatsState {
  id: string;
  text: string;
  imageUrl: string;
  createAt: number;
  authorId: string;
}

interface HomeProps {
  userObj: userObjState;
}

const Wrapper = styled.div`
  padding: 20px 20px;
  padding-bottom: 80px;
`;

const Home: React.FunctionComponent<HomeProps> = ({ userObj }) => {
  const [chats, setChats] = useState<ChatsState[] | []>([]);

  useEffect(() => {
    const ascQuery = query(
      collection(dbService, "chats"),
      orderBy("createAt", "asc")
    );
    onSnapshot(ascQuery, (snapshot) => {
      const newChats = snapshot.docs.map((doc) => ({
        id: doc.id,
        createAt: doc.data().createAt,
        text: doc.data().text,
        imageUrl: doc.data().imageUrl,
        authorId: doc.data().authorId,
      }));
      setChats(newChats);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [chats]);

  return (
    <>
      <Wrapper>
        {chats.map((chat) => (
          <Chat
            key={chat.id}
            chatObj={chat}
            isOwner={userObj.userId === chat.authorId}
          />
        ))}
      </Wrapper>
      <ChatForm userId={userObj.userId} />
    </>
  );
};

export default Home;
