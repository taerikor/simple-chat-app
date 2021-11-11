import { doc, getDoc } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { dbService } from "../../firebase";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: #e8e2e2 2px solid;
  padding: 0 5px;
  height: 35px;
  font-size: 0.8rem;
  color: #ffffff;
  &:hover {
    border: #9b8ded 2px solid;
    color: #9b8ded;
  }
`;

const BoxLink = styled(Link)`
  text-decoration: none;
`;

const UserImg = styled.img`
  border-radius: 50%;
  height: 30px;
  width: 30px;
  margin-right: 8px;
  border: black 1px solid;
  background-color: black;
`;

interface UserCardProps {
  authorId: string;
}
interface userCardObjState {
  displayName: string;
  userImage: string;
}
const UserCard: React.FunctionComponent<UserCardProps> = ({ authorId }) => {
  const [userCardObj, setUserCardObj] = useState<userCardObjState | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const docRef = doc(dbService, "users", `${authorId}`);
      const docSnap = await getDoc(docRef);
      const userData = {
        displayName: docSnap.data()?.displayName,
        userImage: docSnap.data()?.userImage,
      };
      setUserCardObj(userData);
    };
    getUserInfo();
  }, [authorId]);

  return (
    <BoxLink to={`/${authorId}`}>
      <Wrapper>
        {userCardObj && (
          <>
            <UserImg src={userCardObj.userImage} alt="user" />
            <h4>{userCardObj.displayName}</h4>
          </>
        )}
      </Wrapper>
    </BoxLink>
  );
};

export default UserCard;
