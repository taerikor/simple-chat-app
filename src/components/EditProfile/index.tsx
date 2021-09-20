import React, { useState } from 'react'
import { updateProfile, User } from '@firebase/auth'
import { userObjState } from '../App'

interface ProfileProps {
    userObj: userObjState
    userName: string;
}


const EditProfile = ({userObj, userName}:ProfileProps) => {
    const [newName, setNewName] = useState(userName)
    const onSubmit  = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(newName !== userName){
            if(userObj.userInterface === undefined) {
                return null;
            }
                await updateProfile(userObj.userInterface,{displayName:newName})
        }

    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setNewName(value)
    }

    return (
                       <form onSubmit={onSubmit}>
               <input type='text' value={newName} onChange={onChange} />
               <input type='submit' value='Edit' />
           </form>
    )
}

export default EditProfile
