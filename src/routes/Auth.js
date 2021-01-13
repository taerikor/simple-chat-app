import React, { useState } from 'react'
import { authService, firebaseInstance } from '../fbase';

const Auth = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [newAccount,setNewAccount] =useState(true);
  const [error,setError] = useState('');
    const onChange = (e) => {
      const {target:{name , value}} = e;
      if(name === 'email'){
        setEmail(value)
      }else if (name === 'password') {
        setPassword(value)
      }
    }
    const onSubmit = async (e) => {
      e.preventDefault();
      try{
        if(newAccount) {
          await authService.createUserWithEmailAndPassword(
            email,
            password
          );
        } else {
          await authService.signInWithEmailAndPassword(
            email,
            password
          )
        }
      }catch(error){
        setError(error.message)
      }

    }
    const toggleAccount = () =>  setNewAccount((prev) => !prev)
    const onSocialClick = async (e) => {
        const {target:{name}} = e;
        let provider;
        if(name === 'google'){
         provider = new firebaseInstance.auth.GoogleAuthProvider();
        }else if(name === 'github'){
         provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        await authService.signInWithPopup(provider)
    }
    return (
      <>
      <form onSubmit={onSubmit}>
        <input name='email' value={email} type='email' placeholder='Email' required onChange={onChange}/>
        <input name='password' value={password} type='password' placeholder='Password' required onChange={onChange}/>
        <input type='submit' value={newAccount ? 'Create Account' : 'Log In'} />
        {error && <span>{error}</span>}
      </form>
      <span onClick={toggleAccount}>{newAccount ? 'Sign In' : 'Create Account'}</span>
      <div>
        <button name='google' onClick={onSocialClick}>Continue Google</button>
        <button name='github' onClick={onSocialClick}>Continue GitHub</button>
      </div>
      </>
    )
}

export default Auth;