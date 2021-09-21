import React, { useState } from 'react'
import { ref,uploadString,getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from '../../firebase';
import {collection, addDoc } from 'firebase/firestore'

import './ChatForm.css'

interface ChatFormProps {
    userId: string
}

const ChatForm = ({userId}:ChatFormProps ) => {
    const [chat,setChat] = useState("");
    const [readerUrl, setReaderUrl] = useState("")

    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setChat(value)
    }
    const onSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        const storageRef = ref(storageService, `${userId}/${uuidv4()}`)
        let imageUrl = ""
        if(chat !== ""){
            if(readerUrl !== ""){
                await uploadString(
                            storageRef,
                            readerUrl,
                            'data_url'
                            )
                imageUrl = await getDownloadURL(storageRef)
            }
            const chatObj = {
                text: chat,
                createAt:Date.now(),
                imageUrl,
                authorId:userId
            }
                await addDoc(collection(dbService, 'chats') ,chatObj)
                }
                setChat("")
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
        <form className="chatForm" onSubmit={onSubmit}>
        <input value={chat} onChange={onChange} type='textarea' placeholder="Type Chat" />
        <input type='submit' value="Chat!" />
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

export default ChatForm
