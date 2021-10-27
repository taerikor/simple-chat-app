import React, { useEffect, useState } from "react";
import { dbService } from "../firebase";
import {
  getDocs,
  where,
  collection,
  query,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import EditProfile from "../components/EditProfile";
import { userObjState } from "../components/App";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { ChatsState } from "./Home";
import Chat from "../components/Chat";

import styled from "styled-components";
import { Button, Title } from "../utils/style";

export interface PathParamsProps {
  userId: string;
}

interface ProfileProps {
  userObj: userObjState;
}
export interface userInfoObjState {
  displayName: string;
  userImage: string;
  userDesc: string;
}

const UserImg = styled.img`
  max-height: 400px;
  max-width: 400px;
  background-color: white;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  align-items: center;
`;
const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;
const DescWrapper = styled.div`
  min-width: 300px;
  padding: 0 20px;
  min-height: 30%;
  border: 3px solid #666;
  border-radius: 10px;
  margin: 20px 0;
`;
const DescHeader = styled.h3`
  padding: 5px 0;
  margin-bottom: 10px;
  color: #666;
`;
const Name = styled(Title)``;

const Edit = styled.p`
  color: mediumseagreen;
  cursor: pointer;
  border-bottom: 1px solid mediumseagreen;
  &:hover {
    color: #666;
    border-bottom: 1px solid #666;
  }
`;

const Profile: React.FunctionComponent<
  ProfileProps & RouteComponentProps<PathParamsProps>
> = ({ match, userObj }): JSX.Element => {
  const [userInfoObj, setUserInfoObj] = useState<userInfoObjState | null>(null);
  const [myChats, setMyChats] = useState<ChatsState[] | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isMyChat, setIsMyChat] = useState(false);

  const {
    params: { userId },
  } = match;

  const rerenderUserInfo = (data: userInfoObjState) => {
    setUserInfoObj(data);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const docRef = doc(dbService, "users", `${userId}`);
      const docSnap = await getDoc(docRef);
      const userData = {
        displayName: docSnap.data()?.displayName,
        userImage: docSnap.data()?.userImage,
        userDesc: docSnap.data()?.userDesc,
      };
      setUserInfoObj(userData);
    };
    getUserInfo();
  }, [userId]);

  const onToggleEdit = () => {
    setIsEdit((prev) => !prev);
  };
  const onGetMyChats = async () => {
    if (isMyChat === true) {
      setIsMyChat(false);
    } else {
      const q = query(
        collection(dbService, "chats"),
        where("authorId", "==", userId),
        orderBy("createAt", "desc")
      );
      const docs = await getDocs(q);
      const myChats = docs.docs.map((doc) => ({
        id: doc.id,
        createAt: doc.data().createAt,
        text: doc.data().text,
        authorId: doc.data().authorId,
        imageUrl: doc.data().imageUrl,
      }));
      setMyChats(myChats);
      setIsMyChat(true);
    }
  };

  return (
    <Wrapper>
      {isEdit ? (
        <EditProfile
          userObj={userObj}
          onToggleEdit={onToggleEdit}
          rerenderUserInfo={rerenderUserInfo}
        />
      ) : (
        <>
          {userInfoObj && (
            <>
              <ContentWrapper>
                <Name>{`" ${userInfoObj.displayName} "`}</Name>
                {userId === userObj.userId && (
                  <Edit onClick={onToggleEdit}>Edit</Edit>
                )}
              </ContentWrapper>
              <UserImg src={userInfoObj.userImage} alt="profile" />
              <DescWrapper>
                <DescHeader>Description</DescHeader>
                <span>{userInfoObj.userDesc}</span>
              </DescWrapper>
            </>
          )}
          <Button onClick={onGetMyChats}>
            {isMyChat ? "Close" : "Chat Log"}
          </Button>
        </>
      )}
      <div>
        {isMyChat &&
          myChats?.map((chat) => (
            <Chat
              key={chat.id}
              chatObj={chat}
              isOwner={chat.authorId === userObj.userId}
            />
          ))}
      </div>
    </Wrapper>
  );
};

export default withRouter(Profile);
