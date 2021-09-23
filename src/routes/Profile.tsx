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

export interface PathParamsProps {
    userId: string
  }
  
interface ProfileProps {
    userObj: userObjState
}
interface userInfoObjState {
    displayName: string;
    userImage: string;
    userDesc: string;
}

const Profile: React.FunctionComponent<
ProfileProps & RouteComponentProps<PathParamsProps>> = 
({match,userObj}):JSX.Element => {
    const [userInfoObj,setUserInfoObj] = useState<userInfoObjState | null>(null);
    const [isEdit, setIsEdit ] = useState(false);
    const history = useHistory()

    const {params:{userId}} = match;

    const onSignOutClick = async() => {
        signOut(authService)
        history.push("/")
    }

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

    const getMyTweets = async() => {
        const q = query(collection(dbService, "chats"),where("authorId","==", userId),orderBy("createAt",'desc'))
        const docs = await getDocs(q)
        const myChats = docs.docs.map((doc) => ({
            id: doc.id,
            createAt:doc.data().createAt,
            text: doc.data().text,
            userId: doc.data().userId,
            imageUrl: doc.data().imageUrl
        }))
        console.log(myChats)
        // setTweets(myTweets)
    }
    useEffect(() => {
        getMyTweets()
        getUserInfo()
    }, [])

    const onEditToggle = () => {
        setIsEdit((prev) => !prev)
    }
    return (
        <div style={{'marginTop':'50px'}}>
           <button onClick={onSignOutClick}>Log Out</button>
           {userInfoObj && (
               <div>
               <img height='100px' width='100px' src={userInfoObj.userImage} alt='profile'/>
               <h2>{userInfoObj.displayName}</h2>
               <h4>{userInfoObj.userDesc}</h4>
               </div>
           )}
           {userId === userObj.userId && (
               <>
               <button onClick={onEditToggle}>Edit</button>
               {isEdit && <EditProfile userObj={userObj} />}
               </>
           )}
        </div>
    )
}

export default withRouter(Profile)
