import React, { useEffect, useState } from 'react'
import { dbService } from '../firebase';
import {collection, addDoc, onSnapshot} from 'firebase/firestore'
import Tweet from '../components/Tweet'

export interface tweetsState {
    text:string;
    createAt: number;
    id: string;
    userId: string;
}

interface HomeProps {
    userId: string
}

const Home = ({userId}:HomeProps):JSX.Element => {
    const [tweet,setTweet] = useState("");
    const [tweets,setTweets] = useState<tweetsState[]>([]);

    useEffect(() => {
        onSnapshot(collection(dbService, 'tweets'),(snapshot)=>{
            const newTweets = snapshot.docs.map(doc => ({
                id: doc.id,
                createAt:doc.data().createAt,
                text: doc.data().text,
                userId: doc.data().userId,
            }))
            setTweets(newTweets)
        })
    }, [])

    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setTweet(value)
    }
    const onSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        if(tweet !== ""){
            await addDoc(collection(dbService, 'tweets') ,{
                text: tweet,
                createAt:Date.now(),
                userId
            })
        }
        setTweet("")
        
    }
    return (
        <>
        <div>
            <form onSubmit={onSubmit}>
                <input value={tweet} onChange={onChange} type='text' placeholder="What's happening?" />
                <input type='submit' value="Tweet" />
            </form>
        </div>
        <div>
            {tweets.map((tweet) => <Tweet key={tweet.id} tweetObj={tweet} isOwner={userId === tweet.userId} />)}
        </div>
        </>
    )
}

export default Home
