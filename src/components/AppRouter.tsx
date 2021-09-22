import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Auth from '../routes/Auth'
import Home from '../routes/Home'
import Profile from '../routes/Profile'
import Navigation from './Navigation'

import "./App.css"
import { userObjState } from './App'

interface AppRouterProps {
    userObj: userObjState | null
}

const AppRouter = ({userObj}:AppRouterProps):JSX.Element => {



    return (
        <Router>
            {userObj && <Navigation userId={userObj.userId} displayName={userObj.displayName}/>}
            <Switch>
                {userObj ? (
                    <>
                    <Route exact path='/'>
                        <Home userObj={userObj}/>
                    </Route>
                    <Route exact path='/:userId'>
                        <Profile userObj={userObj} />
                    </Route>
                    </>
                ) : (
                    <Route exact path='/'>
                        <Auth />
                    </Route>
                )
                }
            </Switch>
        </Router>
    )
}

export default AppRouter
