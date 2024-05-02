'use client';

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faMessage } from '@fortawesome/free-regular-svg-icons';

const LAPTOP_SCREEN = 1024;

const Navbar = () => {
    const isLoggedIn = true;
    const currentRoute = 'Home';
    const navRoutes = [
        { name: 'Home', route: '/', isLoggedIn: false },
        { name: 'Artworks', route: '/artworks', isLoggedIn: false },
        { name: 'About us', route: '/about', isLoggedIn: false },
        { name: 'Bids', route: '/bids', isLoggedIn: true }
    ]
    const avatar_url = 'https://img.freepik.com/free-photo/graffiti-children-bicycle_1122-2206.jpg?t=st=1714461301~exp=1714464901~hmac=ccbf74e606515181e1f549bfabb4ff2a55e10437094614f8a432d5fa4550a2f6&w=900'

    return (
    <div className='w-screen flex justify-center py-3 shadow-md font-Adamina bg-white'>
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
                (!route.isLoggedIn || route.isLoggedIn === isLoggedIn) && (
                <div key={index} className="flex flex-col justify-center">
                    <button className={`font-medium ${currentRoute === route.name ? 'text-black' : 'text-gray-500'}`}>
                        <Link href={route.route}>{route.name}</Link>
                    </button>
                    <div className={`h-0.5 w-full ${currentRoute === route.name ? 'bg-black' : 'bg-transparent'}`}></div>
                </div>
                )
            ))}
            
            {!isLoggedIn ?
            <div className="flex gap-3 ml-3 items-center">
                <button><Link href='/' className='font-semibold'>Sign up</Link></button>
                <div className='h-5 w-0.5 mx-1 bg-black'></div>
                <button><Link href='/' className='font-semibold'>Login</Link></button>
            </div>
            :
            <div className="flex gap-5 ml-3 items-center">
                <Link href='/'><FontAwesomeIcon className="text-xl" icon={faHeart} /></Link>
                <Link href='/'><FontAwesomeIcon  className="text-xl" icon={faMessage} /></Link>
                <Link href='/'>
                    <Image
                        src={avatar_url} 
                        alt='user' 
                        width={20} 
                        height={20} 
                        style={{ 
                            width: '25px', 
                            height: '25px', 
                            objectFit: 'cover', 
                            borderRadius: '50%',
                        }} 
                    />
                </Link>
            </div>
            }
        </div>
    </div>
    )
}

export default Navbar