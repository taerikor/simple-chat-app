import React, { useState } from 'react'
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider,GithubAuthProvider } from 'firebase/auth'
import { authService } from '../firebase'

const Auth = (): JSX.Element => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newAccount, setNewAccount] = useState(false)

    const onChange = (event: React.ChangeEvent<HTMLInputElement>):void => {
        const value = event.target.value
        const name = event.target.name
        if(name === 'email'){
            setEmail(value)
        }else if (name === 'password'){
            setPassword(value)
        }
    }

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        try{
            let data
            if(newAccount){
             data =  await createUserWithEmailAndPassword(authService,email,password)
            }else {
             data =  await signInWithEmailAndPassword(authService,email,password)
            }
            console.log(data)
        }catch(error){
            console.log(error)
        }
    }
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
            <form onSubmit={onSubmit}>
                <input name='email' type='email' placeholder='email' value={email} onChange={onChange} required />
                <input name='password' type='password' placeholder='password' value={password} onChange={onChange} required />
                <input type='submit' value={newAccount ? 'Create Account' : 'Sign In' } />
            </form>
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
