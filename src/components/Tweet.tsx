import React, { useState } from 'react'
import { tweetsState } from '../routes/Home'
import { deleteDoc,setDoc,doc } from '@firebase/firestore'
import { dbService } from '../firebase'


interface TweetProps {
    tweetObj: tweetsState;
    isOwner: boolean
}

const Tweet = ({tweetObj,isOwner}:TweetProps) => {
    const [isEdit,setIsEdit] = useState(false)
    const [newTweet, setNewTweet] = useState(tweetObj.text)
    const onDeleteClick = () => {
        const confirm = window.confirm("you really delete this?")
        if(confirm){
            deleteDoc(doc(dbService,`tweets/${tweetObj.id}`))
        }
    }

    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setNewTweet(value)
    }
    
    const onSubmit = (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(newTweet !== tweetObj.text){
            setDoc(doc(dbService,`tweets/${tweetObj.id}`),{
                ...tweetObj,
                text:newTweet
            })
        }
        toggleEdit()
    }

    const toggleEdit = () => setIsEdit((prev) => !prev)
    return (
        <div>
            {isEdit ? (
            <>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} value={newTweet} type='text' required placeholder="Edit"/>
                <input type='submit' value='Update' />
            </form>
            <button onClick={toggleEdit}>Cancel</button>
            </>
            ) : 
            (
                <>
                <h3>{tweetObj.text}</h3>
                {isOwner && (
                    <>
                    <button onClick={onDeleteClick}>Delete</button>
                    <button onClick={toggleEdit}>Edit</button>
                    </>
                )}
                </>
            )
            }
        </div>
    )
}

export default Tweet
