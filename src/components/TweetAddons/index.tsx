import React from 'react'
import { deleteDoc, doc} from '@firebase/firestore'
import { dbService, storageService } from '../../firebase'
import { deleteObject,ref } from 'firebase/storage'
import { tweetsState } from '../../routes/Home'

interface TweetAddonsProps {
    toggleEdit: () => void;
    tweetObj: tweetsState
}

const TweetAddons = ({tweetObj,toggleEdit}:TweetAddonsProps) => {
    const onDeleteClick = () => {
        const confirm = window.confirm("you really delete this?")
        if(confirm){
            deleteDoc(doc(dbService,`tweets/${tweetObj.id}`))
            deleteObject(ref(storageService,tweetObj.imageUrl))

        }
    }
    return (
        <>
        <button onClick={onDeleteClick}>Delete</button>
        <button onClick={toggleEdit}>Edit</button>
        </>
    )
}

export default TweetAddons
