import React, { useState } from 'react'
import { updateProfile } from '@firebase/auth'
import { userObjState } from '../App'

interface ProfileProps {
    userObj: userObjState
}


const EditProfile = ({userObj}:ProfileProps) => {
    const [newName, setNewName] = useState(userObj.displayName)
    const [newDesc, setNewDesc] = useState(userObj.userDesc)
    const onSubmit  = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(newName !== userObj.displayName){
            if(userObj.userInterface === undefined) {
                return null;
            }
                await updateProfile(userObj.userInterface,{displayName:newName})
        }

    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        const name = event.target.name
        if(name === 'name'){
            setNewName(value)
        }else if (name === 'desc'){
            setNewDesc(value)
        }
    }

    return (
               <form onSubmit={onSubmit}>
               <input name='name' type='text' value={newName} onChange={onChange} />
               <input name='desc' type='text' value={newDesc} onChange={onChange} />
               <input type='submit' value='Edit' />
           </form>
    )
}

export default EditProfile
