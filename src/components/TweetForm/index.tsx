import React, { useState } from 'react'
import { ref,uploadString,getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from '../../firebase';
import {collection, addDoc } from 'firebase/firestore'

import './TweetForm.css'

interface TweetFormProps {
    userId: string
    userName: string | null;
    userImage: string | null;
}

const TweetForm = ({userId,userName,userImage}:TweetFormProps ) => {
    const [tweet,setTweet] = useState("");
    const [readerUrl, setReaderUrl] = useState("")

    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setTweet(value)
    }
    const onSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        const storageRef = ref(storageService, `${userId}/${uuidv4()}`)
        let imageUrl = ""
        if(tweet !== ""){
            if(readerUrl !== ""){
                await uploadString(
                            storageRef,
                            readerUrl,
                            'data_url'
                            )
                imageUrl = await getDownloadURL(storageRef)
            }
            const tweetObj = {
                text: tweet,
                createAt:Date.now(),
                imageUrl,
                author:{
                    userId,
                    userName,
                    userImage
                }
            }
                await addDoc(collection(dbService, 'tweets') ,tweetObj)
                }
                setTweet("")
                setReaderUrl("")
        
    }
    const onFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
          if(files === null){
              return null;
          }

          const imgFile = files[0];
          const reader = new FileReader();
          reader.onloadend = (event) => {
            const result = reader.result as string
            setReaderUrl(result)
          };
          reader.readAsDataURL(imgFile);
    }
    const onClearURLClick = () => setReaderUrl("")
    return (
        <form className="tweetForm" onSubmit={onSubmit}>
        <input value={tweet} onChange={onChange} type='textarea' placeholder="What's happening?" />
        <input type='submit' value="Tweet" />
        <input type="file" accept="image/*" onChange={onFileChange} />
        {readerUrl && (
            <>
                <img src={readerUrl} alt="upload" height="50px" width="50px" />
                <button onClick={onClearURLClick}>Clear</button>
            </>
        )}
    </form>
    )
}

export default TweetForm
