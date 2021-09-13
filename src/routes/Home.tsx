import React, { useEffect, useState } from 'react'
import { dbService } from '../firebase';
import {collection, addDoc, getDocs} from 'firebase/firestore'

interface tweetsState {
    text:string;
    createAt: number;
    id: string;
}

interface HomeProps {
    userId: string
}

const Home = ({userId}:HomeProps):JSX.Element => {
    const [tweet,setTweet] = useState("");
    const [tweets,setTweets] = useState<tweetsState[]>([]);

    const getTweets = async() => {
        const dbTweets = await getDocs(collection(dbService, 'tweets'))
        dbTweets.forEach((doc) => {
            const tweetObj = {
                createAt:doc.data().createAt,
                text: doc.data().text,
                id: doc.id,
            }
            setTweets((prev) => [tweetObj, ...prev])
        })
    }

    useEffect(() => {
        getTweets();
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
            {tweets.map((tweet) => <div key={tweet.id}>
                <h3>{tweet.text}</h3>
                </div>
                )}
        </div>
        </>
    )
}

export default Home
