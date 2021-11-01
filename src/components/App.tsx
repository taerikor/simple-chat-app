import React, { useEffect, useState } from "react";
import { authService, dbService } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import AppRouter from "./AppRouter";
import { doc, onSnapshot } from "@firebase/firestore";
import styled, { createGlobalStyle } from "styled-components";
export interface userObjState {
  displayName: string;
  userImage: string;
  userDesc: string;
  userId: string;
  userInterface?: User;
}
const Loading = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 800;
`;
const GlobalStyle = createGlobalStyle`
.fa-home {
  font-size: 1.8rem;
  opacity: 0.9;
  margin: 15px 15px;
}
svg {
  color: white;
  &:hover {
    color: #a29898;
  }

}
body {
  margin: 0;
  background-color: #222831;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: white;
}
html, body {
  width: 100%;
  height: 100%;
}

h1,h2,h3,h4,h5,h6{
  padding:0;
  margin:0;
}
`;

const App: React.FunctionComponent = () => {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<userObjState | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
        getUserDoc(user);
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const getUserDoc = async (data: User) => {
    const docRef = doc(dbService, "users", `${data.uid}`);
    onSnapshot(docRef, (docSnap) => {
      const userData = {
        displayName: docSnap.data()?.displayName,
        userImage: docSnap.data()?.userImage,
        userDesc: docSnap.data()?.userDesc,
        userId: docSnap.data()?.userId,
        userInterface: data,
      };
      setUserObj(userData);
    });
  };
  return (
    <>
      <GlobalStyle />
      {init ? (
        <AppRouter userObj={userObj} isLoggedIn={isLoggedIn} />
      ) : (
        <Loading>Loading...</Loading>
      )}
    </>
  );
};

export default App;
