import React, { useState } from 'react'
import { dbService, storageServive } from '../fbase';

const Tweet = ({tweetObj, isOwner}) => {
    const [isEdit,setIsEdit] = useState(false);
    const [newTweet,setNewTweet] =useState(tweetObj.text);
    const onDeleteClick = () => {
        const getConfirm = window.confirm('Delete Tweet?');
        if(getConfirm){
            dbService.doc(`tweets/${tweetObj.id}`).delete();
           tweetObj.attachmentUrl && storageServive.refFromURL(tweetObj.attachmentUrl).delete()
        }
    }
    const onChange = e => {
        const {target:{value}} = e;
        setNewTweet(value)
    }
    const onSubmit = e => {
        e.preventDefault();
        dbService.doc(`tweets/${tweetObj.id}`).update({
            text:newTweet,
        });
        setIsEdit(false);
    }
    const onToggleEdit = () => setIsEdit(prev => !prev)
    return (
        <>
        {isEdit?(
            <>
            <form onSubmit={onSubmit}>
                <input type='text' value={newTweet} onChange={onChange} maxLength={120}/>
                <input type='submit' value='submit' />
            </form>
            <span onClick={onToggleEdit}>Cancel</span>
            </>
        )
        :(
        <div>
            <h4>{tweetObj.text}</h4>
            {tweetObj.attachmentUrl&& <img src={tweetObj.attachmentUrl} 
            alt='upload file' 
            height='150px' 
            width='150px'/>}
            <div>
                <img src={tweetObj.userPhoto} height='50px' width='50px' />
           <h5>{tweetObj.userName}</h5>

            </div>
            {isOwner&& (
                <>
                <button onClick={onDeleteClick}>Delete</button>
                <button onClick={onToggleEdit}>Update</button>
                </>
            )}
        </div>
        )}
        </>
    )
}

export default Tweet;