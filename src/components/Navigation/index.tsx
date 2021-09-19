import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import "./Navigation.css"
interface NavigationProps {
    displayName: string
}
const Navigation = ({displayName}:NavigationProps):JSX.Element => {
    const [pathname,setPathname ] = useState('/')
    const location = useLocation()

    useEffect(()=> {
        if(location.pathname === '/'){
            setPathname('/')
        }else if(location.pathname === '/profile'){
            setPathname('/profile')
        }
    },[location])

    if(pathname === '/'){
        return (
            <nav>
                    <Link to="/profile">
                        {displayName}
                    </Link>
        </nav>
        )
    }else if(pathname === '/profile'){
        return (
            <nav>
                    <Link to="/">
                        Home
                    </Link>

        </nav>
        )
    }
    return <></>
}

export default Navigation
