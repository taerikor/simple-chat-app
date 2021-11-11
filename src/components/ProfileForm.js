import React, { useState } from "react";
import { storageServive } from "../fbase";
import { v4 as uuidv4 } from "uuid";

const ProfileForm = ({ userObj, refreshUser }) => {
  const [newName, setNewName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState("");

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewName(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageServive
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    storageServive.refFromURL(userObj.photoURL)?.delete();
    await userObj.updateProfile({
      displayName: newName,
      photoURL: attachmentUrl,
    });
    refreshUser();
    setAttachment("");
  };

  const onAttachmentChange = (e) => {
    const {
      target: { files },
    } = e;
    if (files[0]) {
      const getFile = files[0];
      const reader = new FileReader();
      reader.onloadend = (finished) => {
        const {
          currentTarget: { result },
        } = finished;
        setAttachment(result);
      };
      reader.readAsDataURL(getFile);
    }
  };

  const onAttachmentClick = () => setAttachment("");
  return (
    <form onSubmit={onSubmit}>
      <div>
        <input type="text" value={newName} onChange={onChange} />
        <input type="submit" value="Edit" />
      </div>
      <label htmlFor="attach-file">
        <span>Edit photo</span>
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onAttachmentChange}
        style={{ opacity: 0 }}
      />
      {attachment && (
        <div>
          <img src={attachment} alt="preview" height="100px" width="100px" />
          <div onClick={onAttachmentClick}>
            <span>Remove</span>
          </div>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
