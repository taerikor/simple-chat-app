import React, { useEffect, useRef } from 'react'
import { ChatsState } from '../../routes/Home'
import { doc,deleteDoc} from '@firebase/firestore'
import { dbService,storageService } from '../../firebase'
import { deleteObject,ref } from 'firebase/storage'

import './chat.css'
import timeForToday from '../../utils/Date'
import UserCard from '../UserCard'


interface Props {
    chatObj: ChatsState;
    isOwner: boolean;
}

const Chat = ({chatObj,isOwner}:Props) => {
    const chatDiv = useRef<HTMLDivElement>(null)

    const onDeleteClick = async () => {
        const confirm = window.confirm("you really delete this?")
        if(confirm){
            await deleteDoc(doc(dbService,`chats/${chatObj.id}`))
            await deleteObject(ref(storageService,chatObj.imageUrl))
        }
    }

    useEffect(() => {
        const OWNER_CN = 'ownerChat'
        const OTHER_CN = 'otherChat'
        if(chatDiv && chatDiv.current ){
            if(isOwner === true){
                chatDiv.current.className = OWNER_CN
            }else {
                chatDiv.current.className = OTHER_CN
            }
        }
    },[isOwner])


    return (
        <div className='chat_container'>
            <div ref={chatDiv} >
                {chatObj.imageUrl && <img src={chatObj.imageUrl} height="80px" width="80px" alt='post' />}
                <div>
                    <UserCard authorId={chatObj.authorId}/>
                </div>
                <h3>{chatObj.text}</h3>
                <div>
                    <h4>{timeForToday(chatObj.createAt)}</h4>
                    {isOwner && <button onClick={onDeleteClick}>Delete</button>}
                </div>
            </div>
        </div>
    )
}

export default Chat
