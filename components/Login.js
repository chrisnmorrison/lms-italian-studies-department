import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [isLoggingIn, setIsLoggingIn] = useState(true)
    const [isLoading, setIsLoading] = useState(false) 

    const { login, signup, currentUser } = useAuth()
    console.log(currentUser)

    // Prevents submission if the user is already logged in
    if (currentUser) {
        return <div>You're already logged in.</div>
    }

    async function submitHandler() {
        if (!email || !password) {
            setError('Please enter both email and password.')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.')
            return
        }

        setIsLoading(true) 

        try {
            if (isLoggingIn) {
                await login(email, password)
            } else {
                await signup(email, password)
            }
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError('No user found with this email.')
            } else if (err.code === 'auth/wrong-password') {
                setError('Incorrect password.')
            } else {
                setError('Something went wrong, please try again later.')
            }
        } finally {
            setIsLoading(false) 
        }
    }

    return (
        <div className='flex-1 text-xs sm:text-sm flex flex-col items-center gap-2 sm:gap-4'>
            <h1 className='font-extrabold select-none text-2xl sm:text-4xl uppercase'>{isLoggingIn ? 'Login' : 'Register'}</h1>
            {error && <div className='w-full max-w-[40ch] border-rose-400 border text-center border-solid text-rose-400 py-2'>{error}</div>}
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email Address'
                className='outline-none duration-300 border-b-2 border-solid border-white focus:border-cyan-300 text-slate-900 p-2 w-full max-w-[40ch]'
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder='Password'
                className='outline-none text-slate-900 p-2 w-full max-w-[40ch] duration-300 border-b-2 border-solid border-white focus:border-cyan-300'
            />
            <button
                onClick={submitHandler}
                disabled={isLoading} // Disable the button when loading
                className={`w-full max-w-[40ch] border border-white border-solid uppercase py-2 duration-300 relative after:absolute after:top-0 after:right-full after:bg-white after:z-10 after:w-full after:h-full overflow-hidden ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:after:translate-x-full after:duration-300 hover:text-slate-900'}`}
            >
                <h2 className='relative z-20'>
                    {isLoading ? 'Please wait...' : 'SUBMIT'}
                </h2>
            </button>
            <h2
                className='duration-300 hover:scale-110 cursor-pointer'
                onClick={() => setIsLoggingIn(!isLoggingIn)}
            >
                {!isLoggingIn ? 'Login' : 'Register'}
            </h2>
        </div>
    )
}
