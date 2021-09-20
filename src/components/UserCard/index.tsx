import React from 'react'

import './UserCard.css'

interface UserCardProps {
    userObj: {
        userName:string;
        userImage:string;
        userId:string
    }
}
const UserCard = ({userObj}:UserCardProps) => {
    return (
        <div className="user_card">
            <img className="user_card_img" src={userObj.userImage} alt='user' />
            <h4>{userObj.userName}</h4>
        </div>
    )
}

export default UserCard
