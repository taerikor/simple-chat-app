import React, { useState } from 'react'
import { authService } from '../fbase';

const AuthForm = () => {
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

    return (
        <>
        <form onSubmit={onSubmit}>
        <input name='email' value={email} type='email' placeholder='Email' required onChange={onChange}/>
        <input name='password' value={password} type='password' placeholder='Password' required onChange={onChange}/>
        <input type='submit' value={newAccount ? 'Create Account' : 'Log In'} />
        {error && <span>{error}</span>}
      </form>
      <span onClick={toggleAccount}>{newAccount ? 'Sign In' : 'Create Account'}</span>
        </>
    )
}

export default AuthForm;