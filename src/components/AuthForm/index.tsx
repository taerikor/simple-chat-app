import React, { useState } from 'react'
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,UserCredential } from 'firebase/auth'
import { authService } from '../../firebase'

interface AuthFormProps {
    newAccount: boolean;
    addUserDoc: (data: UserCredential) => Promise<void>
}

const AuthForm:React.FunctionComponent<AuthFormProps> = ({newAccount,addUserDoc}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
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
            if(newAccount){
             let data =  await createUserWithEmailAndPassword(authService,email,password)
            await addUserDoc(data)
            }else {
              await signInWithEmailAndPassword(authService,email,password)
            }
        }catch(error){
            console.log(error)
        }
    }

    return (
        <form onSubmit={onSubmit}>
        <input name='email' type='email' placeholder='email' value={email} onChange={onChange} required />
        <input name='password' type='password' placeholder='password' value={password} onChange={onChange} required />
        <input type='submit' value={newAccount ? 'Create Account' : 'Sign In' } />
    </form>
    )
}

export default AuthForm
