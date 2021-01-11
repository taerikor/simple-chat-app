import Tweet from 'components/Tweet';
import { dbService, storageService } from 'fbase';
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from "uuid";

const Home = ({userObj}) => {
    const[tweet,setTweet]=useState('');
    const[tweets,setTweets]=useState([]);
    const[attachment, setAttachment] = useState();
    useEffect(()=>{
        dbService.collection('tweets').onSnapshot((snapshot) => {
            const tweetArray = snapshot.docs.map((doc) => ({
                id:doc.id,
                ...doc.data()
            }))
            setTweets(tweetArray);
        })
    },[])
    const onSubmit = async (e) => {
        e.preventDefault();
        let attachmentUrl = '';
        if(attachment !== ''){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
                attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
            text:tweet,
            createAt: Date.now(),
             creatorId: userObj.uid,
             attachmentUrl,
        }
        await dbService.collection('tweets').add(tweetObj);
        setTweet('');
        setAttachment('');
        
    }
    const onChange = (e) => {
        const {target:{value}} = e
        setTweet(value)
    }
    const onFileChange = e => {
        const {target:{files}} = e
        const theFile = files[0]
        const reader = new FileReader()
        reader.onloadend = (finished) => {
            const {currentTarget:{result}} = finished
            setAttachment(result)
        }
        reader.readAsDataURL(theFile)
    }
    const onAttachmentClick = () => setAttachment(null)
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={tweet}type='text' placeholder='tweet' maxLength={120} onChange={onChange} />
                <input type='file' accept='image/*' onChange={onFileChange}/>
                <input type='submit' value='tweet' />
            {attachment&&
            <div>
                <img src={attachment} height='70px' width='70px' alt='Preview'/>
                <button onClick={onAttachmentClick}>X</button>
            </div>
            }
            </form>

            <div>
                {tweets.map((tweet)=> (
                    <Tweet key={tweet.createAt} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
                    ))}
            </div>
        </div>
    )
}
export default Home;