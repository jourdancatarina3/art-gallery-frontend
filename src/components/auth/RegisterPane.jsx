'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useAuthStore } from '@/store/auth';

function RegisterPane() {
    const { checkEmailAvailability, register } = useAuthStore();
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEmailAvailable, setIsEmailAvailable] = useState(true);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [userType, setUserType] = useState(null);
    const [achievements, setAchievements] = useState('');
    const [about, setAbout] = useState('');

    return (
        <form className="min-w-[350px] max-w-[500px] grow flex flex-col gap-4 mb-[80px] px-3">
            <div className='flex justify-center'>
                <Image src='/images/favicon.svg' alt='logo' width={50} height={50} />
            </div>
            <h1 className="text-3xl font-semibold text-center my-5">Create Account</h1>
            <div className="flex flex-col gap-3">
                <label className="input input-bordered flex items-center gap-2 rounded-sm">
                    Email<span className="text-red-500">*</span>
                    <input type="text" className="grow" placeholder="donatello@ninja.com" />
                    {isEmailAvailable !== null && isEmailAvailable && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 text-success" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                    {isEmailAvailable !== null && !isEmailAvailable && (
                        <div className="tooltip tooltip-right tooltip-error" data-tip="Email is already taken :(">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 text-error" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    )}
                    {isCheckingEmail && (
                        <span className="loading loading-infinity loading-sm text-success"></span>
                    )}
                </label>
                <label className="input input-bordered flex items-center gap-2 rounded-sm">
                    Full Name
                    <input type="text" className="grow" placeholder="Michelangelo Perez" />
                </label>
                <label className="input input-bordered flex items-center gap-2 rounded-sm">
                    Display Name<span className="text-red-500">*</span>
                    <input type="text" className="grow" placeholder="Raphael_gwapo123" />
                </label>
                <label className="input input-bordered flex items-center gap-2 rounded-sm">
                    Phone Number
                    <input type="text" className="grow" placeholder="+63..." />
                </label>
                <label className="input input-bordered flex items-center gap-2 rounded-sm">
                    Adress
                    <input type="text" className="grow" placeholder="Crusty crab" />
                </label>
                <label className="input input-bordered flex items-center gap-2 rounded-sm">
                    Avatar URL
                    <input type="text" className="grow" placeholder="" />
                </label>
                <textarea className="textarea textarea-bordered rounded-sm" placeholder="Bio"></textarea>
                <textarea className="textarea textarea-bordered rounded-sm" placeholder="Achievements"></textarea>
                <div className="join w-full flex">
                    <button type="button" className={`btn join-item grow hover:bg-green-300 ${userType === 0 ? 'bg-green-300' : ''}`} onClick={() => setUserType(0)}>Artist</button>
                    <button type="button" className={`btn join-item grow hover:bg-green-300 ${userType === 1 ? 'bg-green-300' : ''}`} onClick={() => setUserType(1)}>Art Collector</button>
                </div>
                <button disabled={!isEmailAvailable || isCheckingEmail} type="submit" class="mt-3 h-full btn btn-neutral text-xl rounded-sm font-normal py-3">Create Account</button>
                <div className="">
                    <p className="text-sm" >Already have an account? <Link href="/login" className="text-blue-400 text-sm">Login</Link></p>
                </div>
            </div>
        </form>
    );
}

export default RegisterPane;
