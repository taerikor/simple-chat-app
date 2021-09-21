import React, { useEffect, useState } from 'react'
import { signOut, User } from '@firebase/auth'
import { authService, dbService } from '../firebase'
import { useHistory, useLocation } from 'react-router'
import {getDocs, where, collection,query,orderBy} from 'firebase/firestore'
import EditProfile from '../components/EditProfile'
import { userObjState } from '../components/App'
import {withRouter, RouteComponentProps } from 'react-router-dom'

export interface PathParamsProps {
    userId: string
  }
  
interface ProfileProps {
    userObj: userObjState
    userName: string;
}
interface userInfoObjState {
    displayName: string;
    photoURL: string;
    userDesc: string;
}

const Profile: React.FunctionComponent<ProfileProps & RouteComponentProps<PathParamsProps>> = ({match,userObj,userName}):JSX.Element => {
    const [userInfoObj,setUserInfoObj] = useState<userInfoObjState | null>(null);
    const history = useHistory()
    const onSignOutClick = async() => {
        signOut(authService)
        history.push("/")
    }

    const getUserInfo = async() => {
        const {params:{userId}} = match;
        const userQuery = query(collection(dbService, "users"),where("userId","==",userId))
        const data = await getDocs(userQuery)
        // const data = doc(dbService,'users',`${authorId}`)
        // const user = await getDoc(data)
        const userData = data.docs.map((doc)=> ({
            displayName: doc.data().displayName,
            photoURL: doc.data().photoURL,
            userDesc: doc.data().userDesc
        }))
        setUserInfoObj(userData[0])
    }

    const getMyTweets = async() => {
        // const q = query(collection(dbService, "chats"),where("userId","==",userObj.userId),orderBy("createAt",'desc'))
        // const docs = await getDocs(q)
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
        getUserInfo()
    }, [])

    return (
        <div style={{'marginTop':'50px'}}>
           <EditProfile userName={userName} userObj={userObj} />
           <button onClick={onSignOutClick}>Log Out</button>
           {userInfoObj && (
               <div>
               <img src={userInfoObj.photoURL} alt='profile'/>
               <h2>{userInfoObj.displayName}</h2>
               <h4>{userInfoObj.userDesc ? userInfoObj.userDesc : 'Null'}</h4>
               </div>
           )}
        </div>
    )
}

export default withRouter(Profile)
