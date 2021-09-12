import React, { useState } from 'react'

const Auth = (): JSX.Element => {
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

    const onSubmit = (event: React.FormEvent):void => {
        event.preventDefault()
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name='email' type='email' placeholder='email' value={email} onChange={onChange} required />
                <input name='password' type='password' placeholder='password' value={password} onChange={onChange} required />
                <input type='submit' value='login' />
            </form>
            <div>
                <button>Continue with Github</button>
                <button>Continue with Google</button>
            </div>
        </div>
    )
}

export default Auth
