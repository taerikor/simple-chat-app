import React from 'react'
import { signOut } from '@firebase/auth'
import { authService } from '../firebase'
import { useHistory } from 'react-router'

const Profile = ():JSX.Element => {
    const history = useHistory()
    const onSignOutClick = async() => {
        signOut(authService)
        history.push("/")
    }
    return (
        <>
           <button onClick={onSignOutClick}>Log Out</button>
        </>
    )
}

export default Profile
