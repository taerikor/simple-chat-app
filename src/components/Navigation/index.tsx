import React from 'react'
import { Link } from 'react-router-dom'

interface NavigationProps {
    displayName: string
}
const Navigation = ({displayName}:NavigationProps):JSX.Element => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/Profile">
                        {displayName}'s Profile
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navigation
