import { dbService, storageService } from 'fbase';
import React, { useState } from 'react'
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const TweetFactory = ({userObj}) => {
    const[attachment, setAttachment] = useState('');
    const[tweet,setTweet]=useState('');
    const onSubmit = async (e) => {
        if (tweet === "") {
            return;
          }
        e.preventDefault();
        let attachmentUrl = '';
        if(attachment !== ''){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
                attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
            text:tweet,
            createAt: Date.now(),
             creatorId: userObj.uid,
             attachmentUrl,
        }
        await dbService.collection('tweets').add(tweetObj);
        setTweet('');
        setAttachment('');
        
    }
    const onChange = (e) => {
        const {target:{value}} = e
        setTweet(value)
    }
    const onFileChange = e => {
        const {target:{files}} = e
        const theFile = files[0]
        const reader = new FileReader()
        reader.onloadend = (finished) => {
            const {currentTarget:{result}} = finished
            setAttachment(result)
        }
        reader.readAsDataURL(theFile)
    }

    const onAttachmentClick = () => setAttachment('')
    return (
        <form onSubmit={onSubmit} className="factoryForm">
          <div className="factoryInput__container">
            <input
              className="factoryInput__input"
              value={tweet}
              onChange={onChange}
              type="text"
              placeholder="What's on your mind?"
              maxLength={120}
            />
            <input type="submit" value="&rarr;" className="factoryInput__arrow" />
          </div>
          <label for="attach-file" className="factoryInput__label">
            <span>Add photos</span>
            <FontAwesomeIcon icon={faPlus} />
          </label>
          <input
            id="attach-file"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{
              opacity: 0,
            }}
          />
          {attachment && (
            <div className="factoryForm__attachment">
              <img
                src={attachment}
                style={{
                  backgroundImage: attachment,
                }}
              />
              <div className="factoryForm__clear" onClick={onAttachmentClick}>
                <span>Remove</span>
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
          )}
        </form>
      );
}
export default TweetFactory;