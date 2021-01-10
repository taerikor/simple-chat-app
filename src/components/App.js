import React, { useEffect, useState } from 'react'
import AppRouter from 'components/Router';
import {authService} from '../fbase'

function App() {
  const [init, setInit] =useState(false)
  const [isLogin,setIsLogin] = useState(false)
  useEffect(()=>{
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLogin(true);
      }else {
        setIsLogin(false);
      }
      setInit(true);
    });
  },[])
  return (
    <>
    {init ? <AppRouter isLogin={isLogin}></AppRouter> : 'Initalizing...'}
    <footer>&copy; {new Date().getFullYear()} Taewitter</footer>
    </>
  );
}

export default App;
