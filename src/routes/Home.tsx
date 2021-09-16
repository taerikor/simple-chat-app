import React, { useEffect, useState } from 'react'
import { dbService } from '../firebase';
import {collection, onSnapshot } from 'firebase/firestore'
import Tweet from '../components/Tweet'
import TweetForm from '../components/TweetForm';

export interface tweetsState {
    text:string;
    createAt: number;
    id: string;
    userId: string;
    imageUrl: string;
}

interface HomeProps {
    userId: string
}



const Home = ({userId}:HomeProps):JSX.Element => {
    
    const [tweets,setTweets] = useState<tweetsState[]>([]);

    useEffect(() => {
        onSnapshot(collection(dbService, 'tweets'),(snapshot)=>{
            const newTweets = snapshot.docs.map(doc => ({
                id: doc.id,
                createAt:doc.data().createAt,
                text: doc.data().text,
                userId: doc.data().userId,
                imageUrl: doc.data().imageUrl
            }))
            setTweets(newTweets)
        })
    }, [])

    return (
        <>
        <div>
            <TweetForm userId={userId} />
        </div>
        <div>
            {tweets.map((tweet) => <Tweet key={tweet.id} tweetObj={tweet} isOwner={userId === tweet.userId}/>)}
        </div>
        </>
    )
}

export default Home
