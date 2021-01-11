import { dbService, storageService } from 'fbase'
import React, { useState } from 'react'

const Tweet = ({tweetObj,isOwner}) => {
    const [isEdit,setIsEdit] = useState(false);
    const [newTweet,setNewTweet] = useState('')
    const onDeleteClick = ()=> {
        const getConfirm = window.confirm('really?')
        if(getConfirm){
            dbService.doc(`tweets/${tweetObj.id}`).delete()
            storageService.refFromURL(tweetObj.attachmentUrl).delete();
        }
    }
    const toggleEdit = () => {
        setIsEdit(prev => !prev)
    }
    const onSubmit = e => {
        e.preventDefault();
        dbService.doc(`tweets/${tweetObj.id}`).update({
            text:newTweet
        })
        setIsEdit(false)
    }
    const onChange= e => {
        const {target:{value}}=e
        setNewTweet(value)
    }
    return(
        <div>
            {isEdit?(
                <>
                <form onSubmit = {onSubmit}>
                    <input type='text' onChange={onChange} value={newTweet} placeholder ='Edit'/>
                    <input type='submit' value='Update' />
                </form>
                    <button onClick={toggleEdit} >Cancel</button>
                </>
            ):(
                <>
                <h4>
                    {tweetObj.text}
                </h4>
                {tweetObj.attachmentUrl && (
                    <img src={tweetObj.attachmentUrl} width="50px" height="50px" alt='upload file' />
                )}
                {isOwner && (
                    <>
                    <button onClick={onDeleteClick}>Delete</button>
                    <button onClick={toggleEdit}>Edit</button>
                    </>
                )}
                </>
            )}

        </div>
    )
}

export default Tweet;