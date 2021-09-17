import React, { useEffect, useState } from 'react';
import { authService } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth'
import AppRouter from './AppRouter';

import "./App.css"




function App():JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [init, setInit] = useState(false)
  const [userObj, setUserObj] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if(user){
        setIsLoggedIn(true)
        setUserObj(user)
      }else {
        setIsLoggedIn(false)
      }
      setInit(true)
    } )
  }, [])
  return (
    <>
    {
      init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/>: 'loading...'
    }
    </>
  );
}

export default App;
