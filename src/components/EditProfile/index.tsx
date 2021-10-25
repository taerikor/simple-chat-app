import React, { useState } from "react";
import { userObjState } from "../App";
import { doc, setDoc } from "@firebase/firestore";
import { dbService, storageService } from "../../firebase";
import { userInfoObjState } from "../../routes/Profile";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import styled from "styled-components";

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
  padding: 0 100px;
  margin: 30px 0;
`;

const Input = styled.input<{ isDesc?: boolean }>`
  background-color: white;
  border-radius: 20px;
  width: 100%;
  height: ${(props) => (props?.isDesc ? "200px" : "40px")};
  padding-left: 10px;
  font-size: 1rem;
  margin-bottom: 20px;
`;
const InputButton = styled.label`
  background-color: green;
  border-radius: 30px;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
`;
const Button = styled.button`
  background-color: green;
  border-radius: 30px;
  padding: 10px 20px;
  margin-left: 10px;
  color: white;
  cursor: pointer;
`;
const HiddenInput = styled.input`
  display: none;
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

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const name = event.target.name;
    if (name === "name") {
      setNewName(value);
    } else if (name === "desc") {
      setNewDesc(value);
    }
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
      {readerUrl && (
        <>
          <PreviewImg src={readerUrl} alt="upload" />
          <Button onClick={onClearURLClick}>Clear</Button>
        </>
      )}
      <InputWrapper>
        <Input name="name" type="text" value={newName} onChange={onChange} />
        <Input
          isDesc={true}
          name="desc"
          type="text"
          value={newDesc}
          onChange={onChange}
        />
        <div>
          <InputButton>
            Change Cover
            <HiddenInput type="file" accept="image/*" onChange={onFileChange} />
          </InputButton>
          <InputButton>
            Submit
            <HiddenInput type="submit" value="Edit" />
          </InputButton>
        </div>
      </InputWrapper>
    </form>
  );
};

export default EditProfile;
