
import { dbService, storageService } from 'fbase'
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Tweet = ({tweetObj,isOwner}) => {
    const [isEdit,setIsEdit] = useState(false);
    const [newTweet,setNewTweet] = useState('')
    const onDeleteClick = ()=> {
        const getConfirm = window.confirm('Delete Tweet?')
        if(getConfirm){
            dbService.doc(`tweets/${tweetObj.id}`).delete()
            tweetObj.attachmentUrl && storageServive.refFromURL(tweetObj.attachmentUrl).delete()
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
        <div className="nweet">
            {isEdit?(
                <>
                <form onSubmit = {onSubmit} className="container nweetEdit">
                    <input type='text' onChange={onChange} value={newTweet} placeholder ='Edit' required autoFocus className="formInput"/>
                    <input type='submit' value='Update' className="formBtn" />
                </form>
                <span onClick={toggleEdit} className="formBtn cancelBtn">
                    Cancel
                </span>
                </>
            ):(
                <>
                <h4>
                    {tweetObj.text}
                </h4>
                {tweetObj.attachmentUrl && (
                    <img src={tweetObj.attachmentUrl} alt='upload file' />
                )}
                <div>
                <img src={tweetObj.userPhoto} height='50px' width='50px'alt='tweet'/>
                <h5>{tweetObj.userName}</h5>
            </div>
                {isOwner && (
                    <div class="nweet__actions">
                        <span onClick={onDeleteClick}>
                        <FontAwesomeIcon icon={faTrash} />
                        </span>
                        <span onClick={toggleEdit}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                    </div>
                )}
                </>
            )}

        </div>
    )
}

export default Tweet;