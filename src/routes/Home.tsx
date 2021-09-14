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
    const [imageURL, setImageURL] = useState("")


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
    const onFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
          if(files === null){
              return null;
          }

          const imgFile = files[0];
          const reader = new FileReader();
          reader.onloadend = (event) => {
            const result = reader.result as string
            setImageURL(result)
          };
          reader.readAsDataURL(imgFile);
    }
    const onClearURLClick = () => setImageURL("")
    return (
        <>
        <div>
            <form onSubmit={onSubmit}>
                <input value={tweet} onChange={onChange} type='text' placeholder="What's happening?" />
                <input type='submit' value="Tweet" />
                <input type="file" accept="image/*" onChange={onFileChange} />
                {imageURL && (
                    <>
                        <img src={imageURL} alt="upload" height="50px" width="50px" />
                        <button onClick={onClearURLClick}>Clear</button>
                    </>
                )}
            </form>
        </div>
        <div>
            {tweets.map((tweet) => <Tweet key={tweet.id} tweetObj={tweet} isOwner={userId === tweet.userId} />)}
        </div>
        </>
    )
}

export default Home
