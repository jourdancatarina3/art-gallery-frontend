'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation' 
import { useDebouncedCallback } from 'use-debounce';

import { useAuthStore } from '@/store/auth';

const infoMaxLength = {
    email: 50,
    fullName: 50,
    username: 50,
    password: 50,
    phoneNumber: 15,
    location: 100,
    bio: 5000,
    achievements: 5000,
}

function RegisterPane() {
    const { checkEmailAvailability, register } = useAuthStore();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState(null);
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [isPasswordMatch, setIsPasswordMatch] = useState(null);
    const [isEmailAvailable, setIsEmailAvailable] = useState(null);
    const [isValidEmailFormat, setIsValidEmailFormat] = useState(null);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setlocation] = useState('');
    const [userType, setUserType] = useState(null);
    const [achievements, setAchievements] = useState('');
    const [about, setAbout] = useState('');

    const emailFormatChecker = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email.trim());
    }

    const checkEmailFormat = useDebouncedCallback(() => {
        if (email !== '') {
            const isValid = emailFormatChecker(email);
            setIsValidEmailFormat(isValid);
            if (isValid) {
                checkEmailAvailable();
            } else {
                setIsEmailAvailable(null);
            }
        }
    }, 1000);

    const checkEmailAvailable = () => {
        setIsCheckingEmail(true);
        checkEmailAvailability(email).then(res => {
            setIsEmailAvailable(res.is_available);
            setIsCheckingEmail(false);
        });
    }

    const handleFullnameInput = (value) => {
        if (fullName === userName) {
            setUserName(value)
        }
        setFullName(value);
    }

    const checkPasswordsMatch = useDebouncedCallback(() => {
        setIsPasswordMatch(password === confirmPassword);
    }, 500)

    const validateUserData = () => {
        if (email.trim().length > infoMaxLength.email || !isValidEmailFormat || !isEmailAvailable
            || fullName.trim().length > infoMaxLength.fullName || userName.trim().length > infoMaxLength.username
            || password.trim().length > infoMaxLength.password || !isPasswordMatch
            || phoneNumber.trim().length > infoMaxLength.phoneNumber || about.trim().length > infoMaxLength.bio
            || achievements.trim().length > infoMaxLength.achievements || !(userType == 0 || userType == 1 || userType === null) 
        ) {
            return false;
        }
        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateUserData()) {
            setIsSubmitting(true);
            const splitedName = fullName.trim().split(' ');
            console.log(splitedName, 'splitedName')
            const lastName = splitedName.pop();
            const firstName = splitedName.join('');
            const data = {
                email: email.trim(),
                first_name: firstName,
                last_name: lastName,
                username: userName.trim(),
                password: password.trim(),
                phone_number: phoneNumber.trim(),
                location: location.trim(),
                user_type: userType,
                achievements: achievements.trim(),
                about: about.trim(),
            }
            try {
                const response = await register(data);
                setIsSubmitting(false);
                if (response) {
                    router.push('/login');
                } else {
                    alert('An error occurred. Please try again');
                }
            } catch (error) {
                setIsSubmitting(false);
                alert('An error occurred. Please try again');
            }
        } else {
            alert('Please fill in all fields correctly');
        }
    }

    useEffect(() => {
        if (email !== null) {
            setIsEmailAvailable(null)
            setIsValidEmailFormat(null)
            checkEmailFormat();
        }
    }, [email]);

    useEffect(() => {
        if (confirmPassword !== null) {
            setIsPasswordMatch(null);
            checkPasswordsMatch();
        }
    }, [password, confirmPassword]);

    return (
        <form
            onSubmit={handleSubmit}
            className="min-w-[350px] max-w-[500px] grow flex flex-col gap-4 mb-[80px] px-3"
        >
            <div className='flex justify-center'>
                <Image src='/images/favicon.svg' alt='logo' width={50} height={50} />
            </div>
            <h1 className="text-3xl font-semibold text-center my-5">Sign up</h1>

            <div className="flex flex-col gap-3">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text flex items-center gap-1">
                            <p>Email</p>
                            <p className="text-red-500 self-start">*</p>
                        </span>
                    </div>
                    <label className="input input-bordered flex items-center gap-2 rounded-sm">
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="text" className="grow" placeholder="Email" maxLength={infoMaxLength.email}
                        />
                        {isEmailAvailable !== null && isEmailAvailable && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 text-success" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        )}
                        {isEmailAvailable !== null && !isEmailAvailable && (
                            <div className="tooltip tooltip-left tooltip-error" data-tip="Email is already taken :(">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 text-error" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        )}
                        {isValidEmailFormat !== null && !isValidEmailFormat && (
                            <div className="tooltip tooltip-left tooltip-error" data-tip="Invalid email">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 text-error" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        )}
                        {isCheckingEmail && (
                            <span className="loading loading-infinity loading-sm text-success"></span>
                        )}
                    </label>
                </label>

                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text flex items-center gap-1">
                            <p>Full Name</p>
                        </span>
                    </div>
                    <label
                        className="input input-bordered flex items-center gap-2 rounded-sm"
                    >
                        <input
                            onChange={(e) => handleFullnameInput(e.target.value)}
                            type="text" className="grow" placeholder="Full Name" maxLength={infoMaxLength.fullName}
                        />
                        <div className="tooltip tooltip-left" data-tip="This information is kept private and will not be displayed publicly.">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </label>
                </label>

                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text flex items-center gap-1">
                            <p>Display Name</p>
                            <p className="text-red-500 self-start">*</p>
                        </span>
                    </div>
                    <label
                        className="input input-bordered flex items-center gap-2 rounded-sm"
                    >
                        <input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            type="text" className="grow" placeholder="Display Name" maxLength={infoMaxLength.username}
                        />
                    </label>
                </label>

                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text flex items-center gap-1">
                            <p>Password</p>
                            <p className="text-red-500 self-start">*</p>
                        </span>
                    </div>
                    <label
                        className="input input-bordered flex items-center gap-2 rounded-sm"
                    >
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" className="grow" placeholder="Password" maxLength={infoMaxLength.password}
                        />
                    </label>
                </label>

                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text flex items-center gap-1">
                            <p>Confirm Password</p>
                            <p className="text-red-500 self-start">*</p>
                        </span>
                    </div>
                    <label
                        className="input input-bordered flex items-center gap-2 rounded-sm"
                    >
                        <input
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password" className="grow" placeholder="Confirm Password"  maxLength={infoMaxLength.password}
                        />
                        {isPasswordMatch !== null && !isPasswordMatch ? (
                            <div className="tooltip tooltip-left tooltip-error" data-tip="Passwords do not match">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 text-error" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        ) : isPasswordMatch !== null && isPasswordMatch && password !== '' && confirmPassword !== '' &&
                        (
                            <div className="tooltip tooltip-left" data-tip="Passwords match">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 text-success" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        )}
                    </label>
                </label>

                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text flex items-center gap-1">
                            <p>Phone Number</p>
                        </span>
                    </div>
                    <label className="input input-bordered flex items-center gap-2 rounded-sm">
                        <input
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            type="text" className="grow" placeholder="Phone Number" maxLength={infoMaxLength.phoneNumber}
                        />
                    </label>
                </label>

                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text flex items-center gap-1">
                            <p>Location</p>
                        </span>
                    </div>
                    <label className="input input-bordered flex items-center gap-2 rounded-sm">
                        <input
                            onChange={(e) => setlocation(e.target.value)}
                            type="text" className="grow" placeholder="Location" maxLength={infoMaxLength.location}
                        />
                        <div className="tooltip tooltip-left" data-tip="This information helps us recommend artworks near you or recommend your artworks to people nearby.">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </label>
                </label>

                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text flex items-center gap-1">
                            <p>Bio</p>
                        </span>
                    </div>
                    <textarea
                        onChange={(e) => setAbout(e.target.value)}
                        className="textarea textarea-bordered rounded-sm h-[100px]" placeholder="Bio (500 characters max)" maxLength={infoMaxLength.bio}
                    ></textarea>
                </label>

                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text flex items-center gap-1">
                            <p>Achievements</p>
                        </span>
                    </div>
                    <textarea
                        onChange={(e) => setAchievements(e.target.value)}
                        className="textarea textarea-bordered rounded-sm" placeholder="Achievements (500 characters max)" maxLength={infoMaxLength.achievements}
                    ></textarea>
                </label>

                <div className="flex justify-between">
                    <p className="text-sm">Choose an option:</p>
                    <div className="tooltip tooltip-left" data-tip="This information is collected for data analysis purposes.">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
                <div className="join w-full flex rounded-sm">
                    <button type="button" className={`btn join-item grow ${userType === 0 ? 'btn-neutral' : ''}`} onClick={() => setUserType(0)}>
                        Artist
                    </button>
                    <button type="button" className={`btn join-item grow ${userType === 1 ? 'btn-neutral' : ''}`} onClick={() => setUserType(1)}>
                        Art Collector
                    </button>
                </div>
                <button
                    disabled={!isEmailAvailable || isCheckingEmail || !isPasswordMatch}
                    type="submit" class="mt-3 h-full btn btn-neutral text-xl rounded-sm font-normal py-3"
                >
                    Create Account
                </button>
                <div className="flex justify-center">
                    <p className="text-sm" >Already have an account? <Link href="/login" className="text-blue-400 text-sm">Login</Link></p>
                </div>
            </div>
        </form>
    );
}

export default RegisterPane;
