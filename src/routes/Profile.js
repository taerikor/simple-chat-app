import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Tweet from '../components/Tweet'
import { authService, dbService } from '../fbase'

const Profile = ({userObj, refreshUser}) => {
    const [newName,setNewName] = useState(userObj.displayName)
    const [tweetsLog,setTweetsLog] = useState([])
    const [attachment,setAttachment] = useState('')
    const history = useHistory();
    
    
    useEffect(() => {
      dbService
   .collection("tweets")
   .where("createId", "==", userObj.uid)
   .orderBy("createAt",'desc')
   .onSnapshot((snapshot)=>{
     const tweetArray = snapshot.docs.map(doc => ({
          id:doc.id,
          ...doc.data()
      }))
      setTweetsLog(tweetArray)
  })

    return () => null;
  }, []);

    const onClick = () => {
        authService.signOut();
        history.push('/')
    }
    const onChange = (e) => {
        const {target:{value}} = e;
        setNewName(value);
    }
    const onSubmit = async (e) => {
        e.preventDefault()
        await userObj.updateProfile({
            displayName:newName,
        })
        refreshUser();
    }
    const onAttachmentChange = (e) => {
        const {target:{files}} = e
        const getFile = files[0]
        const reader = new FileReader();
        reader.onloadend = (finished) => {
            const {currentTarget:{result}} = finished
            setAttachment(result)
        }
        reader.readAsDataURL(getFile);
    }
    const onAttachmentClick = () => setAttachment('')
    return (
        <div>
        <form onSubmit={onSubmit}>
            <div>
            <input type='text' value={newName} onChange={onChange} />
            <input type='submit' value='Edit' />
            </div>
            <label htmlFor="attach-file" >
            <span>Edit photo</span>
        </label>
        <input id='attach-file' type='file' accept='image/*' onChange={onAttachmentChange}             
            style={{opacity: 0,}}/>
        {attachment && (
            <div>
                <img src={attachment} alt='preview' height='100px' width='100px'/>
                <div onClick={onAttachmentClick}>
                    <span>Remove</span>
                </div>
            </div>
        )}
        </form>
        <span onClick={onClick}>Log Out</span>

        <div>
            {tweetsLog.map(tweet => (
                <Tweet key={tweet.createAt} tweetObj={tweet} isOwner={tweet.createId === userObj.uid}/>
            ))}
        </div>
        </div>
    )
}


export default Profile;