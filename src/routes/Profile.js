import { authService, dbService } from 'fbase'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

const Profile = ({refreshUser,userObj}) => {
    const history = useHistory()
    const [newName,setNewName] = useState(userObj.displayName)
    const onLogOutClick = () => {
        authService.signOut()
        history.push('/')
}
// const getMyTweets = async () => {
//     const tweets = await dbService
//       .collection("tweets")
//       .where("creatorId", "==", userObj.uid)
//       .orderBy("createAt")
//       .get();
//     console.log(tweets.docs.map((doc) => doc.data()));
//   };

//   useEffect(() => {
//     getMyTweets();
//   }, []);

    const onChange = (e) => {
        const {target : {value}} = e
        setNewName(value)
    }
    const onSubmit = async (e) => {
        e.preventDefault();
       if(userObj.displayName !== newName){
           await userObj.updateProfile({
               displayName:newName,
           })
           refreshUser();
       }
    }

return(
    <div className="container">
    <form onSubmit={onSubmit}>
        <input onChange={onChange} value={newName} type='text' placeholder='Change Name' className="formInput" autoFocus/>
        <input   
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}/>
    </form>
    <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
) 
}

export default Profile;