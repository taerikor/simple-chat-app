import React, { useEffect, useState } from 'react'
import { signOut } from '@firebase/auth'
import { authService, dbService } from '../firebase'
import { useHistory } from 'react-router'
import {
    getDocs, where, collection,query,orderBy,
    getDoc,doc} from 'firebase/firestore'
import EditProfile from '../components/EditProfile'
import { userObjState } from '../components/App'
import {withRouter, RouteComponentProps } from 'react-router-dom'
import { ChatsState } from './Home'
import Chat from '../components/Chat'

import './Profile.css'

export interface PathParamsProps {
    userId: string
  }
  
interface ProfileProps {
    userObj: userObjState
}
export interface userInfoObjState {
    displayName: string;
    userImage: string;
    userDesc: string;
}

const Profile: React.FunctionComponent<
ProfileProps & RouteComponentProps<PathParamsProps>> = 
({match,userObj}):JSX.Element => {
    const [userInfoObj,setUserInfoObj] = useState<userInfoObjState | null>(null);
    const [myChats, setMyChats] = useState<ChatsState[] | null>(null)
    const [isEdit, setIsEdit ] = useState(false);
    const [isMyChat, setIsMyChat] = useState(false);
    const history = useHistory()

    const {params:{userId}} = match;

    const onSignOutClick = async() => {
        signOut(authService)
        history.push("/")
    }

   
    const rerenderUserInfo = (data:userInfoObjState) => {
        setUserInfoObj(data)
    }

    useEffect(() => {
        const getUserInfo = async() => {
            const docRef = doc(dbService, "users", `${userId}`);
            const docSnap = await getDoc(docRef);
            const userData = {
                displayName: docSnap.data()?.displayName,
                userImage: docSnap.data()?.userImage,
                userDesc: docSnap.data()?.userDesc
            }
            setUserInfoObj(userData)
        }
        getUserInfo()
    }, [userId])

    const onToggleEdit = () => {
        setIsEdit((prev) => !prev)
    }
    const onGetMyChats = async () => {
        if(isMyChat === true){
            setIsMyChat(false)
        }else{
            const q = query(collection(dbService, "chats"),where("authorId","==", userId),orderBy("createAt",'desc'))
            const docs = await getDocs(q)
            const myChats= docs.docs.map((doc) => ({
                id: doc.id,
                createAt:doc.data().createAt,
                text: doc.data().text,
                authorId: doc.data().authorId,
                imageUrl: doc.data().imageUrl
            }))
            setMyChats(myChats)
            setIsMyChat(true)
        }
    }

    return (
        <div className='profile-layout'>
           <button onClick={onSignOutClick}>Log Out</button>
           {userInfoObj && (
            <div className='profile-userinfo'>
                <img src={userInfoObj.userImage} alt='profile'/>
                <h2>{userInfoObj.displayName}</h2>
                <div className='profile-userinfo-desc'>
                    <h4>Description</h4>
                    <span>{userInfoObj.userDesc}</span>
                </div>
            </div>
           )}
           {userId === userObj.userId && (
               <>
               {isEdit ? <EditProfile userObj={userObj} onToggleEdit={onToggleEdit} rerenderUserInfo={rerenderUserInfo} />
                    :<button onClick={onToggleEdit}>Edit</button>}
               </>
           )}
        <div>
        <button onClick={onGetMyChats}>{`${isMyChat? 'Close': 'Open'} my chats`}</button>
           {isMyChat && (
               myChats?.map((chat) => (
                <Chat key={chat.id} chatObj={chat}/>))
           )}
        </div>
                   </div>
    )
}

export default withRouter(Profile)
