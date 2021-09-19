import React, { useState } from 'react'
import { tweetsState } from '../../routes/Home'
import { doc,deleteDoc} from '@firebase/firestore'
import { dbService,storageService } from '../../firebase'
import { deleteObject,ref } from 'firebase/storage'

import './chat.css'


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
        <>
        {isOwner ? (
        <div className="ownerChat">
                {tweetObj.imageUrl && <img src={tweetObj.imageUrl} height="80px" width="80px" alt='post' />}
                <h3>{tweetObj.text}</h3>
                            <button onClick={onDeleteClick}>Delete</button>
        </div>
        ):(
            <div className="otherChat">
            {tweetObj.imageUrl && <img src={tweetObj.imageUrl} height="80px" width="80px" alt='post' />}
            <h3>{tweetObj.text}</h3>
    </div>
        )}
        </>
    )
}

export default Tweet
