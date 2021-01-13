import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { authService } from '../fbase'

const Profile = ({userObj, refreshUser}) => {
    const [newName,setNewName] = useState(userObj.displayName)
    const history = useHistory();
    const onClick = () => {
        authService.signOut();
        history.push('/')
    }
    const onChange = (e) => {
        const {target:{value}} = e;
        setNewName(value);
    }
    const onSubmit = async (e) => {
        e.preventDefault()
        await userObj.updateProfile({
            displayName:newName,
        })
        refreshUser();
    }
    return (
        <div>
        <form onSubmit={onSubmit}>
            <input type='text' value={newName} onChange={onChange} />
            <input type='submit' value='Edit' />
        </form>
        <span onClick={onClick}>Log Out</span>
        </div>
    )
}

export default Profile;