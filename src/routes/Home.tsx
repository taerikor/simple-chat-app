import React, { useEffect, useState } from 'react'
import { dbService } from '../firebase';
import {collection, onSnapshot,query,orderBy} from 'firebase/firestore'
import Chat from '../components/Chat'
import ChatForm from '../components/ChatForm';
import { User } from '@firebase/auth';

export interface ChatsState {
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
    
    const [chats,setChats] = useState<ChatsState[] | []>([]);

    useEffect(() => {
        const ascQuery = query(collection(dbService, "chats"),orderBy("createAt",'asc'))
        onSnapshot(ascQuery,(snapshot)=>{
            const newChats = snapshot.docs.map(doc => ({
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
            setChats(newChats)
        })
    }, [])

    useEffect(() => {
        window.scrollTo(0,document.body.scrollHeight);
    },[chats])

    return (
        <div
        style={{'height':'100vh'}}
        >
        <div
                style={{
                    'display':'flex',
                    'flexDirection':'column',
                    'marginBottom': '50px',
                            }}
        >
            {chats.map((chat) => <Chat key={chat.id} chatObj={chat} isOwner={userObj.uid === chat.author.userId}/>)}
        </div>
            <ChatForm userId={userObj.uid} userName={userObj.displayName } userImage={userObj.photoURL} />
        </div>
    )
}

export default Home
