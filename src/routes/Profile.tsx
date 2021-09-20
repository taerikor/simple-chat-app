import React, { useEffect, useState } from 'react'
import { signOut, User } from '@firebase/auth'
import { authService, dbService } from '../firebase'
import { useHistory } from 'react-router'
import {getDocs, where, collection,query,orderBy} from 'firebase/firestore'
import EditProfile from '../components/EditProfile'
import { userObjState } from '../components/App'


interface ProfileProps {
    userObj: userObjState
    userName: string;
}

const Profile = ({userObj,userName}:ProfileProps):JSX.Element => {
    const history = useHistory()
    const onSignOutClick = async() => {
        signOut(authService)
        history.push("/")
    }
    const getMyTweets = async() => {
        const q = query(collection(dbService, "chats"),where("userId","==",userObj.userId),orderBy("createAt",'desc'))
        const docs = await getDocs(q)
        // const myTweets = docs.docs.map((doc) => ({
        //     id: doc.id,
        //     createAt:doc.data().createAt,
        //     text: doc.data().text,
        //     userId: doc.data().userId,
        //     imageUrl: doc.data().imageUrl
        // }))
        
        // setTweets(myTweets)
    }
    useEffect(() => {
        getMyTweets()
    }, [])

    return (
        <div style={{'marginTop':'50px'}}>
           <EditProfile userName={userName} userObj={userObj} />
           <button onClick={onSignOutClick}>Log Out</button>
        </div>
    )
}

export default Profile
