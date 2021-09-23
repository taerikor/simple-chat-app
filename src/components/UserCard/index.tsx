import { doc, getDoc } from '@firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dbService } from '../../firebase'

import './UserCard.css'

interface UserCardProps {
    authorId:string
}
interface userCardObjState {
    displayName: string;
    userImage: string;
}
const UserCard = ({authorId}:UserCardProps) => {
    const [userCardObj,setUserCardObj] = useState<userCardObjState | null>(null)
    useEffect(()=>{
        getUserInfo()
    },[])

    const getUserInfo = async() => {
        const docRef = doc(dbService, "users", `${authorId}`);
        const docSnap = await getDoc(docRef);
        const userData = {
            displayName: docSnap.data()?.displayName,
           userImage: docSnap.data()?.userImage,
        }
        setUserCardObj(userData)
    }
    return (
        <div className="user_card">
            {userCardObj && (
                <Link to={`/${authorId}`}>
                <img className="user_card_img" src={userCardObj.userImage} alt='user' />
                <h4>{userCardObj.displayName}</h4>
                </Link>
            )}
        </div>
    )
}

export default UserCard
