import { authService, firebaseInstance } from 'fbase';
import React, { useState } from 'react'

const Auth = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [newAccount,setNewAccount] = useState(true)
    const [error,setError] = useState('');
    const onChnage = (e) => {
        const {target:{name,value}} = e;
        if(name === 'email'){
            setEmail(value)
        }else if(name === 'password'){
            setPassword(value)
        }
    }
    const onSubmit = async (e) => {
       e.preventDefault();
       try{
           if(newAccount){
            await authService.createUserWithEmailAndPassword(email, password);
           }else{
            await authService.signInWithEmailAndPassword(email,password);
           }
       }catch(error) {
           setError(error.message)
       }
        
    }
    const toggleAccount = () => setNewAccount((prev) => !prev)
    const onSocialClick = async (e) => {
        const {target:{name}} = e
        let provider;
        if(name === 'google'){
           provider = new firebaseInstance.auth.GoogleAuthProvider();
        }else if(name === 'github'){
           provider = new firebaseInstance.auth.GithubAuthProvider()
        }
        await authService.signInWithPopup(provider)
    }
return (
    <>
    <form onSubmit={onSubmit}> 
        <input name='email' type='email' placeholder='Email' required value={email} onChange={onChnage} />
        <input name='password' type='password' placeholder='Password' required value={password} onChange={onChnage}/>
        <input type='submit' value={newAccount? 'Create Account':'Log In'} /> 
    </form>
    <span onClick={toggleAccount}>
    {newAccount?'Sign In':'Create Account'}
    </span>

    {error}
    <div>
        <button name='google' onClick={onSocialClick}>Continue Google</button>
        <button name='github' onClick={onSocialClick}>Continue Github</button>

    </div>
</>
)

}

export default Auth;