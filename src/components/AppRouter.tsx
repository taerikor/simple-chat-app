import React,{useState} from 'react'
import { User } from '@firebase/auth'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Auth from '../routes/Auth'
import Home from '../routes/Home'
import Profile from '../routes/Profile'
import Navigation from './Navigation'


interface AppRouterProps {
    isLoggedIn: boolean
    userObj: User | null
}

const AppRouter = ({isLoggedIn,userObj}:AppRouterProps):JSX.Element => {

    const [displayName,setDisplayName] = useState(userObj?.displayName ? userObj.displayName : "User")

    const renderUserName = (newName:string):void => {
        setDisplayName(newName)
    }

    return (
        <Router>
            {isLoggedIn && <Navigation displayName={displayName}/>}
            <Switch>
                {isLoggedIn && userObj ? (
                    <>
                    <Route exact path='/'>
                        <Home userId={userObj.uid}/>
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
            </Switch>
        </Router>
    )
}

export default AppRouter
