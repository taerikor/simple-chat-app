import { collection, doc, DocumentData, getDoc, getDocs, query, where } from '@firebase/firestore'
import React, { useEffect, useState } from 'react'
import { dbService } from '../../firebase'
import { userObjState } from '../App'

import './UserCard.css'

interface UserCardProps {
    authorId:string
}
interface userCardObjState {
    displayName: string;
    photoURL: string;
}
const UserCard = ({authorId}:UserCardProps) => {
    const [userCardObj,setUserCardObj] = useState<userCardObjState | null>(null)
    useEffect(()=>{
        getUserInfo()
    },[])

    const getUserInfo = async() => {
        const userQuery = query(collection(dbService, "users"),where("userId","==",authorId))
        const data = await getDocs(userQuery)
        // const data = doc(dbService,'users',`${authorId}`)
        // const user = await getDoc(data)
        const userData = data.docs.map((doc)=> ({
            displayName: doc.data().displayName,
            photoURL: doc.data().photoURL,
        }))
        setUserCardObj(userData[0])
    }
    return (
        <div className="user_card">
            {userCardObj && (
                <>
                <img className="user_card_img" src={userCardObj.photoURL} alt='user' />
                <h4>{userCardObj.displayName}</h4>
                </>
            )}
        </div>
    )
}

export default UserCard
