import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = ({userObj}) => {
    return (
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <div>
            <Link to='/profile'>
              <img src={userObj.photoURL} width='80px' height='80px' alt='profile' /> 
              {userObj.displayName}'s Profile
              </Link>
          </div>
        </ul>
      </nav>
    )
}

export default Navigation;