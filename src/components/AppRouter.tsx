import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Auth from '../routes/Auth'
import Home from '../routes/Home'
import Profile from '../routes/Profile'
import Navigation from './Navigation'

interface AppRouterProps {
    isLoggedIn: boolean
    userId: string
}

const AppRouter = ({isLoggedIn,userId}:AppRouterProps):JSX.Element => {
    return (
        <Router>
            {isLoggedIn && <Navigation />}
            <Switch>
                {isLoggedIn ? (
                    <>
                    <Route exact path='/'>
                        <Home userId={userId}/>
                    </Route>
                    <Route exact path='/profile'>
                        <Profile />
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
