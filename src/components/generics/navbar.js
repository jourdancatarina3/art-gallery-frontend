'use client';

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
    const isLoggedIn = false;
    const currentRoute = 'Artworks';
    const navRoutes = [
        { name: 'Home', route: '/', isLoggedIn: false },
        { name: 'Artworks', route: '/artworks', isLoggedIn: false },
        { name: 'Bids', route: '/bids', isLoggedIn: true }
    ]
    return (
    <div className='w-screen flex justify-center py-3 shadow-md font-Adamina'>
        <div className='container xl grow flex gap-3 px-5 justify-between'>
            <div className="flex gap-2 items-center">
                <Image src='/images/favicon.svg' alt='logo' width={30} height={30} />
                <h1 className='text-2xl font-semibold text-black font-Adamina'>FASO | GALLERY</h1>
            </div>
            <label className="input input-bordered mx-5 grow flex items-center gap-2 rounded-sm">
                <input type="text" className="grow" placeholder="Search Artwork" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            </label>
            {navRoutes.map((route, index) => (
                <div key={index} className="flex flex-col justify-center">
                    <button className={`font-medium ${currentRoute === route.name ? 'text-black' : 'text-gray-500'}`}>
                        <Link href={route.route}>{route.name}</Link>
                    </button>
                    <div className={`h-0.5 w-full ${currentRoute === route.name ? 'bg-black' : 'bg-transparent'}`}></div>
                </div>
            ))}
            {!isLoggedIn &&
            <div className="flex gap-2 ml-3 items-center">
                <button><Link href='/' className='font-medium'>Sign up</Link></button>
                <button><Link href='/' className='font-medium'>Login</Link></button>
            </div>
            }
        </div>
    </div>
    )
}

export default Navbar