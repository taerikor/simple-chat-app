import React, { useState } from 'react';
import AppRouter from './AppRouter';



function App() {
const [isLoggedIn, setIsLoggedIn] = useState(false)
  return (
    <AppRouter isLoggedIn={isLoggedIn}/>
  );
}

export default App;
