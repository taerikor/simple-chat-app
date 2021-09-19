import React, { useState } from 'react'
import { tweetsState } from '../../routes/Home'
import { doc,deleteDoc} from '@firebase/firestore'
import { dbService,storageService } from '../../firebase'
import { deleteObject,ref } from 'firebase/storage'

import './chat.css'
import timeForToday from '../../utils/Date'


interface TweetProps {
    tweetObj: tweetsState;
    isOwner: boolean;
}

const Tweet = ({tweetObj,isOwner}:TweetProps) => {

    const onDeleteClick = () => {
        const confirm = window.confirm("you really delete this?")
        if(confirm){
            deleteDoc(doc(dbService,`tweets/${tweetObj.id}`))
            deleteObject(ref(storageService,tweetObj.imageUrl))

        }
    }


    return (
        <div className='chat_container'>
        {isOwner ? (
        <div className="ownerChat">
            <div>
                {tweetObj.imageUrl && <img src={tweetObj.imageUrl} height="80px" width="80px" alt='post' />}
                <div>
                <h4>{tweetObj.author.userName}</h4>
                </div>
                <h3>{tweetObj.text}</h3>
                <div>
                <h4>{timeForToday(tweetObj.createAt)}</h4>
                <button onClick={onDeleteClick}>Delete</button>
                </div>
            </div>
        </div>
        ):(
            <div className="otherChat">
                <div>
            {tweetObj.imageUrl && <img src={tweetObj.imageUrl} height="80px" width="80px" alt='post' />}
            <h4>{tweetObj.author.userName}</h4>
            <h3>{tweetObj.text}</h3>
            <div>
            <h4>{timeForToday(tweetObj.createAt)}</h4>
            </div>
                </div>
    </div>
        )}
        </div>
    )
}

export default Tweet
