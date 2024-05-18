'use client';

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';

import { useAuthStore } from '@/store/auth';
import { useArtworkStore } from '@/store/artwork';
import UserDropdown from '@/components/generics/UserDropdown';

const LAPTOP_SCREEN = 1024;

const Navbar = (props) => {
    const { showSearch=false } = props;
    const { user, getUser } = useAuthStore();
    const { fetchArtworks } = useArtworkStore();
    const router = useRouter();
    const pathname = usePathname();

    const userDropDown = useRef();
    const [searchKey, setSearchKey] = useState('');
    const isLoggedIn = user !== null;
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const navRoutes = [
        { name: 'Home', route: '/', isLoggedIn: false },
        { name: 'Artworks', route: '/artworks', isLoggedIn: false },
        // { name: 'About us', route: '/about', isLoggedIn: false },
        // { name: 'Bids', route: '/bids', isLoggedIn: true }
    ]
    const avatar_url = user?.avatar_url || 'https://i.pinimg.com/564x/80/01/3b/80013ba9fbd82789fba7dd72e2428b96.jpg';
    const [screenWidth, setScreenWidth] = useState(0);
    const [collapseLinks, setCollapseLinks] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) getUser();
    }, [pathname]);

    useEffect(() => {    
        function handleClickOutside(event) {
            if (userDropDown.current && !userDropDown.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    useEffect(() => {
        if (screenWidth < LAPTOP_SCREEN) setCollapseLinks(true);
        else setCollapseLinks(false);
    }, [screenWidth])

    useEffect(() => {
        setScreenWidth(window.innerWidth);
        function handleResize() {
            setScreenWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    },[])


    return (
    <nav className='navbar h-[75px] w-screen flex justify-center py-3 shadow-md font-Adamina bg-white'>
        <div className='container xl grow flex gap-3 px-5 justify-between'>
            <div onClick={() => {router.push('/')}} className="flex gap-2 items-center cursor-pointer">
                <Image src='/images/favicon.svg' alt='logo' width={30} height={30} />
                <h1 className='text-2xl font-semibold text-black font-Adamina'>FASO | GALLERY</h1>
            </div>
            {showSearch && !collapseLinks && (
                <label className="input input-bordered mx-5 grow flex items-center gap-2 rounded-sm">
                    <input
                        onChange={e => setSearchKey(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && router.push(`/artworks?search=${searchKey}`)}
                        type="text" className="grow" placeholder="Search Artwork or Artist..."
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                </label>
                )   
            }
            {!collapseLinks && (
            <div className="flex gap-3">
                {navRoutes.map((route, index) => (
                    (!route.isLoggedIn || route.isLoggedIn === isLoggedIn) && (
                    <div key={index} className="flex flex-col justify-center">
                        <button className={`font-medium ${pathname === route.route ? 'text-black' : 'text-gray-500'}`}>
                            <Link href={route.route}>{route.name}</Link>
                        </button>
                        <div className={`h-0.5 w-full ${pathname === route.route ? 'bg-black' : 'bg-transparent'}`}></div>
                    </div>
                    )
                ))}
                
                {!isLoggedIn ?
                <div className="flex gap-3 ml-3 items-center">
                    <button><Link href='/register' className='font-semibold'>Sign up</Link></button>
                    <div className='h-5 w-0.5 mx-1 bg-black'></div>
                    <button><Link href='/login' className='font-semibold'>Login</Link></button>
                </div>
                :
                <div className="flex gap-5 ml-3 items-center">
                    <div className="indicator">
                        <span className="indicator-item badge badge-error text-xs px-[2px] w-[10px] h-[10px]"></span> 
                        <Link href='/'><FontAwesomeIcon  className="text-xl" icon={faMessage} /></Link>
                    </div>
                    <div className="indicator">
                        <span className="indicator-item badge badge-error text-xs px-[2px] w-[10px] h-[10px]"></span> 
                        <Link href='/'><FontAwesomeIcon  className="text-xl" icon={faBell} /></Link>
                    </div>
                    <div ref={userDropDown} className='flex items-center'>
                        <button
                            className="w-[25px]"
                            onClick={() => {setShowUserDropdown(!showUserDropdown)}}
                        >
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
                        </button>
                        {showUserDropdown && <UserDropdown userName={user.username} userId={user.id} avatarUrl={user.avatar_url} />}
                    </div>
                </div>
                }
            </div>
            )}
        </div>
    </nav>
    )
}

export default Navbar