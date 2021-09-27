import React, { useState } from 'react'
import { userObjState } from '../App'
import { doc, setDoc } from '@firebase/firestore'
import { dbService } from '../../firebase'
import { userInfoObjState } from '../../routes/Profile'

interface ProfileProps {
    userObj: userObjState;
    onToggleEdit:() => void;
    rerenderUserInfo:(data:userInfoObjState) => void;
}


const EditProfile = ({userObj,onToggleEdit,rerenderUserInfo}:ProfileProps) => {
    const [newName, setNewName] = useState(userObj.displayName)
    const [newDesc, setNewDesc] = useState(userObj.userDesc)

    const onSubmit  = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await setDoc(doc(dbService,`users/${userObj.userId}`),{
                displayName:newName,
                userId:userObj.userId,
                userImage:userObj.userImage,
                userDesc:newDesc,
        })
        rerenderUserInfo({
            displayName:newName,
            userImage:userObj.userImage,
            userDesc:newDesc
        })
        onToggleEdit()
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
