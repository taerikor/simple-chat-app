import React, { useEffect, useState } from 'react'
import { dbService, storageService } from '../firebase';
import {collection, addDoc, onSnapshot } from 'firebase/firestore'
import { ref,uploadString,getDownloadURL } from 'firebase/storage'
import Tweet from '../components/Tweet'
import { v4 as uuidv4 } from 'uuid';

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
    const [tweet,setTweet] = useState("");
    const [tweets,setTweets] = useState<tweetsState[]>([]);
    const [readerUrl, setReaderUrl] = useState("")


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

    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setTweet(value)
    }
    const onSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        const storageRef = ref(storageService, `${userId}/${uuidv4()}`)
        let imageUrl = ""
        if(tweet !== ""){
            if(readerUrl !== ""){
                await uploadString(
                            storageRef,
                            readerUrl,
                            'data_url'
                            )
                imageUrl = await getDownloadURL(storageRef)
            }
            const tweetObj = {
                text: tweet,
                createAt:Date.now(),
                userId,
                imageUrl
            }
                await addDoc(collection(dbService, 'tweets') ,tweetObj)
                }
                setTweet("")
                setReaderUrl("")
        
    }
    const onFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
          if(files === null){
              return null;
          }

          const imgFile = files[0];
          const reader = new FileReader();
          reader.onloadend = (event) => {
            const result = reader.result as string
            setReaderUrl(result)
          };
          reader.readAsDataURL(imgFile);
    }
    const onClearURLClick = () => setReaderUrl("")
    return (
        <>
        <div>
            <form onSubmit={onSubmit}>
                <input value={tweet} onChange={onChange} type='text' placeholder="What's happening?" />
                <input type='submit' value="Tweet" />
                <input type="file" accept="image/*" onChange={onFileChange} />
                {readerUrl && (
                    <>
                        <img src={readerUrl} alt="upload" height="50px" width="50px" />
                        <button onClick={onClearURLClick}>Clear</button>
                    </>
                )}
            </form>
        </div>
        <div>
            {tweets.map((tweet) => <Tweet key={tweet.id} tweetObj={tweet} isOwner={userId === tweet.userId}/>)}
        </div>
        </>
    )
}

export default Home
