import React, { useEffect, useState } from 'react'
import { authService } from '../fbase';
import AppRouter from './Router'
import Img from '../img/userPhoto.png'


function App() {
  const [init,setInit] = useState(false);
  const [userObj,setUserObj] = useState(null);


  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        const displayName = user.displayName ? user.displayName : 'USER'
        const photoURL = user.photoURL ? user.photoURL : Img
        setUserObj({
          displayName,
          photoURL,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        })
      }else {
        setUserObj(null)
      }
      setInit(true)
    })

  },[])
  const refreshUser = () => {
    const user = authService.currentUser;
    const displayName = user.displayName ? user.displayName : 'USER'
    const photoURL = user.photoURL ? user.photoURL : Img
    setUserObj({
      displayName,
      photoURL,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    })
  }

  return (
   <>
    {init ? <AppRouter refreshUser={refreshUser} userObj={userObj} isLogin={Boolean(userObj)} /> : 'Initialize...' }
   </>
  );
}

export default App;
