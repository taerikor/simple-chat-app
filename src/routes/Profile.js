import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Tweet from '../components/Tweet'
import { authService, dbService } from '../fbase'
import ProfileForm from '../components/ProfileForm';

const Profile = ({userObj, refreshUser}) => {

    const [tweetsLog,setTweetsLog] = useState([])
    const history = useHistory();
    
    const getMyTweets = async () => {
       await dbService
        .collection("tweets")
        .where("createId", "==", userObj.uid)
        .orderBy("createAt",'desc')
        .onSnapshot((snapshot)=>{
          const tweetArray = snapshot.docs.map(doc => ({
               id:doc.id,
               ...doc.data()
           }))
           setTweetsLog(tweetArray)
       })
     
    }

    useEffect(() => {
        getMyTweets();
        
    return () => null;
  },[ ]);

    const onClick = () => {
        authService.signOut();
        history.push('/')
    }


    return (
          <div className="container">
                  <ProfileForm userObj={userObj} refreshUser={refreshUser}/>
//     <form onSubmit={onSubmit}>
//         <input onChange={onChange} value={newName} type='text' placeholder='Change Name' className="formInput" autoFocus/>
//         <input   
//           type="submit"
//           value="Update Profile"
//           className="formBtn"
//           style={{
//             marginTop: 10,
//           }}/>
//     </form>
    <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
         <div>
            {tweetsLog.map(tweet => (
                <Tweet key={tweet.createAt} tweetObj={tweet} isOwner={tweet.createId === userObj.uid}/>
            ))}
        </div>
    </div>
    )
}


export default Profile;