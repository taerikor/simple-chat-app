import React, { useState } from 'react'
import { signInWithPopup,GoogleAuthProvider,GithubAuthProvider } from 'firebase/auth'
import { authService } from '../firebase'
import AuthForm from '../components/AuthForm'

const Auth = (): JSX.Element => {
    const [newAccount, setNewAccount] = useState(false)


    const toggleNewAccount = () => {
        setNewAccount((prev) => !prev)
    }

    const onSocialClick = async(event:React.MouseEvent<HTMLElement>) => {
        const name:string = (event.target as any).name
        let provider: any
        if(name === 'google'){
            provider = new GoogleAuthProvider()
        }else if(name === 'github'){
            provider = new GithubAuthProvider()
        }
        await signInWithPopup(authService, provider)
    }

    return (
        <div>
            <AuthForm newAccount={newAccount} />
            <span onClick={toggleNewAccount}>
                {newAccount ? 'Sign In' : 'Create Account'}
            </span>
            <div>
                <button name='google' onClick={onSocialClick}>Continue with Google</button>
                <button name='github' onClick={onSocialClick}>Continue with Github</button>
            </div>
        </div>
    )
}

export default Auth
