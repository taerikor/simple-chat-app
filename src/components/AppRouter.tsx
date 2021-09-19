import React,{useEffect, useState} from 'react'
import { User } from '@firebase/auth'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Auth from '../routes/Auth'
import Home from '../routes/Home'
import Profile from '../routes/Profile'
import Navigation from './Navigation'

import "./App.css"

interface AppRouterProps {
    isLoggedIn: boolean
    userObj: User | null
}

const AppRouter = ({isLoggedIn,userObj}:AppRouterProps):JSX.Element => {

    const [displayName,setDisplayName] = useState('')

    const renderUserName = (newName:string):void => {
        setDisplayName(newName)
    }

    useEffect(()=>{
        if(userObj!== null){
            if(userObj.displayName !== null){
                setDisplayName(userObj.displayName)
            }
        }
    },[userObj])

    return (
        <Router>
            {isLoggedIn && <Navigation displayName={displayName}/>}
            <Switch>
                <div
                style={{
                    'marginTop': '50px'
                }}
                >
                {isLoggedIn && userObj ? (
                    <>
                    <Route exact path='/'>
                        <Home userObj={userObj}/>
                    </Route>
                    <Route exact path='/profile'>
                        <Profile userObj={userObj} renderUserName={renderUserName} userName={displayName}/>
                    </Route>
                    </>
                ) : (
                    <Route exact path='/'>
                        <Auth />
                    </Route>
                )
                }
                </div>
            </Switch>
        </Router>
    )
}

export default AppRouter
