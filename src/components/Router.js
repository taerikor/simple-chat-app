import React from 'react'
import {HashRouter as Router , Route , Switch} from 'react-router-dom'
import Profile from 'routes/Profile'
import Auth from '../routes/Auth'
import Home from '../routes/Home'
import Navigation from './Navigation'

const AppRouter = ({refreshUser,isLogin ,userObj}) => {

    return(
    <Router>
        {isLogin && <Navigation userObj={userObj} />}
        <Switch>
            {isLogin ?
             (<div 
                style={{
                    maxWidth: 890,
                    width: "100%",
                    margin: "0 auto",
                    marginTop: 80,
                    display: "flex",
                    justifyContent: "center",
                  }}
             >
             <Route exact path='/'>
                 <Home userObj={userObj} />
             </Route>
             <Route exact path='/profile'>
                 <Profile refreshUser={refreshUser} userObj={userObj} />
             </Route>
             </div>)
            :(
            <>
             <Route exact path='/'>
                 <Auth />
             </Route>
             </>
             )}
        </Switch>
    </Router>)
}

export default AppRouter;