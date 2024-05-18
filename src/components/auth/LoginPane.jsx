'use client';
import { useState, useEffect } from 'react'
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { useAuthStore } from '@/store/auth';

function LoginPane() {
    const { user, login, getUser } = useAuthStore()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect') || '/'
    const paramEmail = searchParams.get('email')
    
    const [email, setEmail] = useState(paramEmail || '')
    const [password, setPassword] = useState('')
    const [loginFail, setLoginFail] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    
    const handleLogin = async (event) => {
        event.preventDefault()
        setIsLoggingIn(true)
        try {
            const not_banned = await login(email, password);
            setLoginFail(false)
            if (!not_banned) {
                router.push('/banned')
                return
            }
            router.push(redirect);
        } catch (e) {
            setLoginFail(true)
            console.error(e)
        } finally {
            setIsLoggingIn(false)
        }
    }

    const navigateToRegister = () => {
        router.push(`/register?redirect=${redirect}`)
    }

    const checkUser = async () => {
        if (user) {
            router.push('/')
        } else {
            await getUser()
            if (user) {
                router.push('/')
            }
        }
    }

    useEffect(() => {
        checkUser();
    },[])

    return (
        <form onSubmit={handleLogin} className="w-[350px] flex flex-col gap-4 mb-[80px]" >
            <div className='flex justify-center'>
                <Image src='/images/favicon.svg' alt='logo' width={50} height={50} />
            </div>
            <h1 className="text-3xl font-semibold text-center my-5">
                {!paramEmail ? 'Welcome back!' : 'FASO | GALLERY'}
            </h1>

            <label className="input input-bordered flex items-center gap-2 rounded-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="text" className="grow" placeholder="Email"
                />
            </label>
            
            <div>
                <label className={`input input-bordered flex items-center gap-2 rounded-sm ${loginFail ? 'input-error': ''}`} >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                        <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                    </svg>
                    <input
                        onChange={e => setPassword(e.target.value)}
                        type="password" className="grow" placeholder="password"
                    />
                </label>
                <p className={`text-xs text-rose-500 ${loginFail ? 'block': 'hidden'}`}>Wrong email or password</p>
            </div>

            <button disabled={isLoggingIn} type="submit" class="w-full btn btn-active rounded-sm btn-neutral w-[300px]">{!isLoggingIn ? 'Login' : 'Loging in...'}</button>
            <div className="flex justify-between w-full">
                <Link href="/recover" className="text-xs text-gray-500">Forgot password?</Link>
                <button onClick={navigateToRegister} className="text-xs text-gray-500 ml-2 text-blue-400 ">Create an account</button>
            </div>
        </form>
    )
}

export default LoginPane