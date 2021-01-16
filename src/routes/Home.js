import React, { useEffect, useState } from 'react'
import Tweet from '../components/Tweet'
import { dbService } from '../fbase'
import TweetsForm from '../components/TweetsForm';

const Home = ({userObj}) => {
    const [tweets,setTweets] = useState([])
    const [getTweets,setGetTweets] = useState(10)

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        if ((scrollTop + clientHeight >= scrollHeight)&& getTweets < 15) {
            setGetTweets(getTweets + 10)
        }
    }

    useEffect(()=>{
        dbService.collection('tweets').orderBy("createAt",'desc').limit(getTweets).onSnapshot((snapshot)=>{
           const tweetArray = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data()
            }))
            setTweets(tweetArray)
        })

        return () => null;
    },[getTweets])

    useEffect(()=> {
         window.addEventListener('scroll',handleScroll)

         return () =>  window.removeEventListener('scroll',handleScroll)
    },[])

    return (
        <>
        <TweetsForm userObj={userObj}/>
        <div>
            {tweets.map(tweet => (
                <Tweet key={tweet.createAt} tweetObj={tweet} isOwner={tweet.createId === userObj.uid}/>
            ))}
        </div>
        </>
    )
}

export default Home;
