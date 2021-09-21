import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import "./Navigation.css"
interface NavigationProps {
    displayName: string
    userId: string;
}
const Navigation = ({displayName,userId}:NavigationProps):JSX.Element => {
    const [isHome,setIsHome ] = useState(true)
    const location = useLocation()

    useEffect(()=> {
        if(location.pathname === '/'){
            setIsHome(true)
        }else {
            setIsHome(false)
        }
    },[location])

    if(isHome){
        return (
            <nav>
                    <Link to={`/${userId}`}>
                        {displayName}
                    </Link>
        </nav>
        )
    }else {
        return (
            <nav>
                    <Link to="/">
                        Home
                    </Link>

        </nav>
        )
    }
}

export default Navigation
