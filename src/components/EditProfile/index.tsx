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
    reader.onloadend = (event) => {
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
          <button onClick={onClearURLClick}>Clear</button>
        </>
      )}
      <input name="name" type="text" value={newName} onChange={onChange} />
      <input name="desc" type="text" value={newDesc} onChange={onChange} />
      <input type="submit" value="Edit" />
      <input type="file" accept="image/*" onChange={onFileChange} />
    </form>
  );
};

export default EditProfile;
