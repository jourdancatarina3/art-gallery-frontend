'use client';

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

import { useAuthStore } from '@/store/auth';

function NewArtworkPane() {
    const router = useRouter();
    const { user } = useAuthStore();
    const pathname = usePathname();

    useEffect(() => {
        if (!user) {
            router.push(`/login?redirect=${pathname}`)
        }
    }, [])
return (
    <div>NewArtworkPane</div>
)
}

export default NewArtworkPane