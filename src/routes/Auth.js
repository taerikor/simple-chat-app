import React from 'react'
import AuthForm from '../components/AuthForm';
import { authService, firebaseInstance } from '../fbase';

const Auth = () => {


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
      <AuthForm />
      <div>
        <button name='google' onClick={onSocialClick}>Continue Google</button>
        <button name='github' onClick={onSocialClick}>Continue GitHub</button>
      </div>
      </>
    )
}

export default Auth;