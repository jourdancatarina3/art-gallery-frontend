'use client';

import { forwardRef } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/auth';

const UserDropdown = forwardRef((props, ref) => {
    const { userName, userId } = props;
    const { logout } = useAuthStore();

    return (
        <div ref={ref} className="absolute translate-x-[-85%]">
            <div className="bg-neutral-800 rounded-md shadow-lg w-[150px]">
                <div className="flex flex-col gap-2 py-2 px-3">
                    <a href={`/user/${userId}`} className="text-white truncate hover:bg-white/[0.1] transition duration-100">
                        {userName}
                    </a>
                    <a href={`/user/${userId}/artworks`} className="text-white hover:bg-white/[0.1] transition duration-100">My Artworks</a>
                    <a href={`/user/${userId}/settings`} className="text-white hover:bg-white/[0.1] transition duration-100">Settings</a>
                    <a
                        onClick={logout}
                        className="text-red-300 hover:bg-white/[0.1] transition duration-100"
                    >
                        Logout
                    </a>
                </div>
            </div>
        </div>
    );
});

UserDropdown.displayName = 'UserDropdown';

export default UserDropdown;