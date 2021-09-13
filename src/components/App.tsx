import React, { useEffect, useState } from 'react';
import { authService } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth'
import AppRouter from './AppRouter';




function App():JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [init, setInit] = useState(false)
  const [userObj, setUserObj] = useState<any>(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if(user){
        setIsLoggedIn(true)
        setUserObj(user)
        console.log(user)
      }else {
        setIsLoggedIn(false)
      }
      setInit(true)
    } )
  }, [])
  return (
    <>
    {
      init ? <AppRouter isLoggedIn={isLoggedIn} userId={userObj.uid}/>: 'loading...'
    }
    </>
  );
}

export default App;
