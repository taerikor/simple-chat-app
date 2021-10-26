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

const Toggle = styled(Button)`
  margin-right: 10px;
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
              <Title>{`" ${userInfoObj.displayName} "`}</Title>
              <UserImg src={userInfoObj.userImage} alt="profile" />
              <DescWrapper>
                <DescHeader>Description</DescHeader>
                <span>{userInfoObj.userDesc}</span>
              </DescWrapper>
            </>
          )}
          <ContentWrapper>
            <Toggle onClick={onGetMyChats}>{`${
              isMyChat ? "Close" : "Open"
            } my chats`}</Toggle>
            {userId === userObj.userId && (
              <Toggle onClick={onToggleEdit}>Edit</Toggle>
            )}
          </ContentWrapper>
        </>
      )}
      <div>
        {isMyChat &&
          myChats?.map((chat) => (
            <Chat key={chat.id} chatObj={chat} isOwner={true} />
          ))}
      </div>
    </Wrapper>
  );
};

export default withRouter(Profile);
