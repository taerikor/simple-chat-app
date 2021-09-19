import React, { useEffect, useState } from 'react'
import { dbService } from '../firebase';
import {collection, onSnapshot,query,orderBy} from 'firebase/firestore'
import Tweet from '../components/Tweet'
import TweetForm from '../components/TweetForm';
import { User } from '@firebase/auth';

export interface tweetsState {
    id: string;
    text: string;
    imageUrl: string;
    createAt: number;
    author:{
        userName:string;
        userId: string;
        userImage: string
    }
}

interface HomeProps {
    userObj: User
}



const Home = ({userObj}:HomeProps):JSX.Element => {
    
    const [tweets,setTweets] = useState<tweetsState[] | []>([]);

    useEffect(() => {
        const ascQuery = query(collection(dbService, "tweets"),orderBy("createAt",'asc'))
        onSnapshot(ascQuery,(snapshot)=>{
            const newTweets = snapshot.docs.map(doc => ({
                id: doc.id,
                createAt:doc.data().createAt,
                text: doc.data().text,
                imageUrl: doc.data().imageUrl,
                author:{
                    userName:doc.data().author.userName,
                    userId: doc.data().author.userId,
                    userImage: doc.data().author.userImage
                }
            }))
            console.log(newTweets)
            setTweets(newTweets)
        })
    }, [])

    useEffect(() => {
        window.scrollTo(0,document.body.scrollHeight);
    },[tweets])

    return (
        <>
        <div
                style={{
                    'display':'flex',
                    'flexDirection':'column',
                    'marginBottom': '50px'
                            }}
        >
            {tweets.map((tweet) => <Tweet key={tweet.id} tweetObj={tweet} isOwner={userObj.uid === tweet.author.userId}/>)}
        </div>
        <>
            <TweetForm userId={userObj.uid} userName={userObj.displayName } userImage={userObj.photoURL} />
        </>
        </>
    )
}

export default Home
