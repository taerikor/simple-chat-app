import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { authService } from "../../firebase";
import styled from "styled-components";

interface AuthFormProps {
  newAccount: boolean;
  addUserDoc: (data: UserCredential) => Promise<void>;
}
const Input = styled.input<{ toggle?: boolean }>`
  background-color: ${(props) => (props?.toggle ? "#3bf52a" : "white")};
  border-radius: 20px;
  width: 300px;
  height: 40px;
  color: ${(props) => (props?.toggle ? "white" : "black")};
  cursor: ${(props) => (props?.toggle ? "pointer" : "auto")};
  padding-left: 10px;
  font-size: 1rem;
  margin-bottom: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AuthForm: React.FunctionComponent<AuthFormProps> = ({
  newAccount,
  addUserDoc,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    const name = event.target.name;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (newAccount) {
        let data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
        await addUserDoc(data);
      } else {
        await signInWithEmailAndPassword(authService, email, password);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Input
        name="email"
        type="email"
        placeholder="email"
        value={email}
        onChange={onChange}
        required
      />
      <Input
        name="password"
        type="password"
        placeholder="password"
        value={password}
        onChange={onChange}
        required
      />
      <Input
        toggle={true}
        type="submit"
        value={newAccount ? "Create Account" : "Sign In"}
      />
    </Form>
  );
};

export default AuthForm;
