import React, { useEffect, useState } from 'react'
import Tweet from '../components/Tweet'
import { dbService, storageServive } from '../fbase'
import { v4 as uuidv4 } from "uuid";

const Home = ({userObj}) => {
    const [tweet,setTweet] = useState('')
    const [tweets,setTweets] = useState([])
    const [attachment,setAttachment] = useState('')

    useEffect(()=>{
        dbService.collection('tweets').onSnapshot((snapshot)=>{
           const tweetArray = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data()
            }))
            setTweets(tweetArray)
        })
    },[])
    const onChange = (e) => {
        const {target : {value}} = e;
        setTweet(value)
    }
    const onSubmit = async (e) => {
        if(tweet === ''){
            return null;
        }
        e.preventDefault();
        let attachmentUrl = '';
        if(attachment !== ''){
            const attachmentRef = storageServive.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, 'data_url');
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
            text:tweet,
            createAt:Date.now(),
            createId:userObj.uid,
            attachmentUrl,
        }
        await dbService.collection('tweets').add(tweetObj);
        setTweet('')
        setAttachment('');
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
        <>
        <form onSubmit={onSubmit}>
        <div>
        <input type='text' value={tweet} placeholder='Tweet' maxLength={120} onChange={onChange} />
        <input type='submit' value='&rarr;' />
        </div>
        <label htmlFor="attach-file" >
            <span>Add photos</span>
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
        <div>
            {tweets.map(tweet => (
                <Tweet key={tweet.createAt} tweetObj={tweet} isOwner={tweet.createId === userObj.uid}/>
            ))}
        </div>
        </>
    )
}

export default Home;
