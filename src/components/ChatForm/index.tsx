import React, { useState } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleDown,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

interface ChatFormProps {
  userId: string;
}
const FormWrapper = styled.div`
  display: block;
  height: auto;
  position: fixed;
  bottom: 0;
  width: 100%;
  color: white;
`;
const InputWrapper = styled.div`
  background-color: #0000008c;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;
const ChatInput = styled.input`
  min-height: 30px;
  border-radius: 30px;
  padding-left: 10px;
  width: 80%;
`;
const PreviewImg = styled.img`
  max-width: 200px;
  max-height: 200px;
`;

const InputButton = styled.label`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  margin-left: 10px;
`;
const HiddenInput = styled.input`
  display: none;
`;

const ChatForm: React.FunctionComponent<ChatFormProps> = ({
  userId,
}: ChatFormProps) => {
  const [chat, setChat] = useState("");
  const [readerUrl, setReaderUrl] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setChat(value);
  };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const storageRef = ref(storageService, `${userId}/${uuidv4()}`);
    let imageUrl = "";
    if (chat !== "") {
      if (readerUrl !== "") {
        await uploadString(storageRef, readerUrl, "data_url");
        imageUrl = await getDownloadURL(storageRef);
      }
      const chatObj = {
        text: chat,
        createAt: Date.now(),
        imageUrl,
        authorId: userId,
      };
      await addDoc(collection(dbService, "chats"), chatObj);
    }
    setChat("");
    setReaderUrl("");
  };
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files === null) {
      return null;
    }

    const imgFile = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setReaderUrl(result);
    };
    reader.readAsDataURL(imgFile);
  };
  const onClearURLClick = () => setReaderUrl("");
  return (
    <form onSubmit={onSubmit}>
      <FormWrapper>
        {readerUrl && (
          <>
            <PreviewImg src={readerUrl} alt="upload" />
            <button onClick={onClearURLClick}>Clear</button>
          </>
        )}
        <InputWrapper>
          <ChatInput
            value={chat}
            onChange={onChange}
            type="textarea"
            placeholder="Type Chat"
          />
          <InputButton>
            <FontAwesomeIcon icon={faArrowUp} />
            <HiddenInput id="input-submit" type="submit" />
          </InputButton>
          <InputButton>
            <FontAwesomeIcon icon={faArrowAltCircleDown} />
            <HiddenInput type="file" accept="image/*" onChange={onFileChange} />
          </InputButton>
        </InputWrapper>
      </FormWrapper>
    </form>
  );
};

export default ChatForm;
