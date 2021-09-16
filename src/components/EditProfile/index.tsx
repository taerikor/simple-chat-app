import React, { useState } from 'react'
import { updateProfile, User } from '@firebase/auth'

interface ProfileProps {
    userObj: User
    renderUserName: (newName: string) => void
    userName: string
}


const EditProfile = ({renderUserName, userObj, userName}:ProfileProps) => {
    const [newName, setNewName] = useState(userName)
    const onSubmit  = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(newName !== userName){
            await updateProfile(userObj,{displayName:newName})
            renderUserName(newName)
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
