import React, { useEffect, useState } from 'react';
import { authService } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth'
import AppRouter from './AppRouter';




function App():JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [init, setInit] = useState(false)

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if(user){
        setIsLoggedIn(true)
      }else {
        setIsLoggedIn(false)
      }
      setInit(true)
    } )
  }, [])
  return (
    <>
    {
      init ? <AppRouter isLoggedIn={isLoggedIn}/>: 'loading...'

    }
    </>
  );
}

export default App;
