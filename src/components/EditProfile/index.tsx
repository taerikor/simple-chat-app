import React, { useState } from "react";
import { userObjState } from "../App";
import { doc, setDoc } from "@firebase/firestore";
import { dbService, storageService } from "../../firebase";
import { userInfoObjState } from "../../routes/Profile";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import styled, { css, ThemeProvider } from "styled-components";
import { Button, Theme, Title } from "../../utils/style";

interface ProfileProps {
  userObj: userObjState;
  onToggleEdit: () => void;
  rerenderUserInfo: (data: userInfoObjState) => void;
}

const PreviewImg = styled.img`
  max-height: 100px;
  max-width: 100px;
  background-color: white;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Input = css`
  background-color: white;
  border-radius: 8px;
  padding: 10px 10px;
  font-size: 1rem;
  margin-bottom: 10px;
`;
const Name = styled.input`
  ${Input}
`;

const Desc = styled.textarea`
  ${Input}
  min-height: 100px;
`;
const ButtonWrapper = styled.div`
  display: flex;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Form = styled.form`
  width: 80%;
`;
const EditButton = styled(Button)`
  margin-right: 5px;
`;

const EditProfile: React.FunctionComponent<ProfileProps> = ({
  userObj,
  onToggleEdit,
  rerenderUserInfo,
}: ProfileProps) => {
  const [newName, setNewName] = useState(userObj.displayName);
  const [newDesc, setNewDesc] = useState(userObj.userDesc);
  const [readerUrl, setReaderUrl] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const storageRef = ref(storageService, `${userObj.userId}/${uuidv4()}`);
    let imageUrl = "";
    if (readerUrl !== "") {
      await uploadString(storageRef, readerUrl, "data_url");
      imageUrl = await getDownloadURL(storageRef);
    }
    await setDoc(doc(dbService, `users/${userObj.userId}`), {
      displayName: newName,
      userId: userObj.userId,
      userImage: `${imageUrl ? imageUrl : userObj.userImage}`,
      userDesc: newDesc,
    });
    rerenderUserInfo({
      displayName: newName,
      userImage: `${imageUrl ? imageUrl : userObj.userImage}`,
      userDesc: newDesc,
    });
    onToggleEdit();
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewName(value);
  };
  const onDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setNewDesc(value);
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
    <Form onSubmit={onSubmit}>
      {readerUrl && (
        <>
          <PreviewImg src={readerUrl} alt="upload" />
          <Button onClick={onClearURLClick}>Clear</Button>
        </>
      )}
      <InputWrapper>
        <Title>Edit Profile</Title>
        <Name type="text" value={newName} onChange={onNameChange} />
        <Desc value={newDesc} onChange={onDescChange} />
        <ButtonWrapper>
          <ThemeProvider theme={Theme}>
            <EditButton onClick={() => onToggleEdit()}>Cancle</EditButton>
          </ThemeProvider>
          <EditButton>
            Change Cover
            <HiddenInput type="file" accept="image/*" onChange={onFileChange} />
          </EditButton>
          <EditButton>
            Submit
            <HiddenInput type="submit" value="Edit" />
          </EditButton>
        </ButtonWrapper>
      </InputWrapper>
    </Form>
  );
};

export default EditProfile;
