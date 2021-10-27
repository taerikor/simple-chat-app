import React, { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  UserCredential,
  getAdditionalUserInfo,
} from "firebase/auth";
import { authService, dbService } from "../firebase";
import AuthForm from "../components/AuthForm";
import { collection, doc, setDoc } from "@firebase/firestore";
import styled from "styled-components";

const LoginButton = styled.button`
  background: #686a68;
  border-radius: 20px;
  width: 300px;
  height: 40px;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 1rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

const Title = styled.h1`
  margin-bottom: 60px;
  font-size: 70px;
  letter-spacing: -5px;
  font-weight: 900;
  color: mediumseagreen;
`;

const Auth: React.FunctionComponent = () => {
  const [newAccount, setNewAccount] = useState(false);

  const toggleNewAccount = () => {
    setNewAccount((prev) => !prev);
  };

  const onSocialClick = async (event: React.MouseEvent<HTMLElement>) => {
    const name: string = (event.target as any).name;
    let provider: any;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    let data = await signInWithPopup(authService, provider);
    await addUserDoc(data);
  };

  const addUserDoc = async (data: UserCredential) => {
    const emailAndPasswordUserProviderId = "password";
    const googleUserProviderId = "google.com";
    let userObj = {};
    const userInfo = getAdditionalUserInfo(data);
    if (userInfo) {
      if (userInfo.providerId === emailAndPasswordUserProviderId) {
        userObj = {
          displayName: "User",
          userImage: "https://freesvg.org/img/abstract-user-flat-1.png",
          userId: data.user.uid,
          userDesc: "Empty",
        };
      } else if (userInfo.providerId === googleUserProviderId) {
        userObj = {
          displayName: data.user.displayName,
          userImage: data.user.photoURL,
          userId: data.user.uid,
          userDesc: "Empty",
        };
      }
      if (userInfo.isNewUser) {
        await setDoc(
          doc(collection(dbService, "users"), `${data.user.uid}`),
          userObj
        );
      }
    }
  };

  return (
    <>
      <Wrapper>
        <Title>SIMPLE CHAT</Title>
        <AuthForm newAccount={newAccount} addUserDoc={addUserDoc} />
        <LoginButton onClick={toggleNewAccount}>
          {newAccount ? "Sign In" : "Create Account"}
        </LoginButton>
        <div>
          <LoginButton name="google" onClick={onSocialClick}>
            Continue with Google
          </LoginButton>
          {/* <button name="github" onClick={onSocialClick}>
          Continue with Github
        </button> */}
        </div>
      </Wrapper>
    </>
  );
};

export default Auth;
