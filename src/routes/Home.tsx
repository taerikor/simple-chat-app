import React, { useEffect, useState } from 'react'
import { dbService } from '../firebase';
import {collection, onSnapshot,query,orderBy} from 'firebase/firestore'
import Chat from '../components/Chat'
import ChatForm from '../components/ChatForm';
import { userObjState } from '../components/App';

export interface ChatsState {
    id: string;
    text: string;
    imageUrl: string;
    createAt: number;
    authorId:string;
}

interface HomeProps {
    userObj: userObjState
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
                authorId:doc.data().authorId
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
            {chats.map((chat) => <Chat key={chat.id} chatObj={chat} isOwner={userObj.userId === chat.authorId}/>)}
        </div>
            <ChatForm userId={userObj.userId} />
        </div>
    )
}

export default Home
