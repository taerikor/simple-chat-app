import React, { useState } from 'react'
import { signInWithPopup,GoogleAuthProvider,GithubAuthProvider,UserCredential,getAdditionalUserInfo } from 'firebase/auth'
import { authService, dbService } from '../firebase'
import AuthForm from '../components/AuthForm'
import { addDoc, collection } from '@firebase/firestore'

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
        let data = await signInWithPopup(authService, provider)
        console.log(data)
        await addUserDoc(data)
    }

    const addUserDoc = async (data:UserCredential) => {
        const emailAndPasswordUserProviderId = 'password'
        const googleUserProviderId = 'google.com'
        let userObj = {}
        const userInfo = getAdditionalUserInfo(data)
        if(userInfo){
            if(userInfo.providerId === emailAndPasswordUserProviderId){
                userObj = {
                    displayName: "User",
                    photoURL:`https://source.unsplash.com/user/${data.user.uid}/300x300`,
                    userId: data.user.uid
                 }
            }else if (userInfo.providerId === googleUserProviderId){
                userObj = {
                    displayName: data.user.displayName,
                    photoURL:data.user.photoURL,
                    userId: data.user.uid
    
                }
            }
            if(userInfo.isNewUser){
                await addDoc(collection(dbService, 'users') ,userObj)
            }
        }
    }

    return (
        <div>
            <AuthForm newAccount={newAccount} addUserDoc={addUserDoc} />
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
