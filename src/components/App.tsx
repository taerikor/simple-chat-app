import React, { useState } from 'react';
import { authService } from '../firebase';
import AppRouter from './AppRouter';




function App():JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  return (
    <AppRouter isLoggedIn={isLoggedIn}/>
  );
}

export default App;
