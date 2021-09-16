import React, { useEffect, useState } from 'react'
import { signOut, User } from '@firebase/auth'
import { authService, dbService } from '../firebase'
import { useHistory } from 'react-router'
import {getDocs, where, collection,query,orderBy} from 'firebase/firestore'
import EditProfile from '../components/EditProfile'


interface ProfileProps {
    userObj: User
    renderUserName: (newName: string) => void
    userName: string
}

const Profile = ({renderUserName,userObj,userName}:ProfileProps):JSX.Element => {
    const history = useHistory()
    const onSignOutClick = async() => {
        signOut(authService)
        history.push("/")
    }
    const getMyTweets = async() => {
        const q = query(collection(dbService, "tweets"),where("userId","==",userObj.uid),orderBy("createAt",'desc'))
        const docs = await getDocs(q)

        console.log(docs)
    }
    useEffect(() => {
        getMyTweets()
    }, [])

    return (
        <>
           <EditProfile renderUserName={renderUserName} userName={userName} userObj={userObj} />
           <button onClick={onSignOutClick}>Log Out</button>
        </>
    )
}

export default Profile
