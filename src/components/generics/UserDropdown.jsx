'use client';

import { forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faPalette } from '@fortawesome/free-solid-svg-icons';

import { useAuthStore } from '@/store/auth';

const UserDropdown = forwardRef((props, ref) => {
    const { logout, defaultAvatarUrl } = useAuthStore();
    const { userName, userId, avatarUrl } = props;

    return (
        <div ref={ref} className="absolute translate-x-[-90%] translate-y-[60%]">
            <div className="bg-neutral-800 rounded-md shadow-lg w-[250px]">
                <div className="flex flex-col gap-3 p-4">
                    <a href={`/user/${userId}`} className="flex items-center gap-2 text-white truncate hover:underline transition duration-100">
                        <Image
                            src={avatarUrl || defaultAvatarUrl} 
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
                        {userName}
                    </a>
                    <hr className='opacity-20'></hr>
                    <div className='flex flex-col gap-2 pl-3'>
                        <a href={`/user/${userId}`} className="flex gap-2 items-center text-white hover:underline transition duration-100">
                            <FontAwesomeIcon icon={faPalette} />
                            My Artworks
                        </a>
                        <a href={`/liked`} className="flex gap-2 items-center text-white hover:underline transition duration-100">
                            <FontAwesomeIcon icon={faHeart} />
                            Liked artworks
                        </a>
                        <a href={`/user/${userId}/settings`} className="flex gap-2 items-center text-white hover:underline transition duration-100">
                            <FontAwesomeIcon icon={faGear} />
                            Settings
                        </a>
                        <a
                            onClick={logout}
                            className="flex gap-2 items-center text-red-500 drop-shadow-md cursor-pointer hover:underline transition duration-100"
                        >
                            <FontAwesomeIcon icon={faPowerOff} />
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
});

UserDropdown.displayName = 'UserDropdown';

export default UserDropdown;