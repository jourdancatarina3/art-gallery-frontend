'use client';

import React from 'react'
import Link from 'next/link';

function page() {
    return (
        <div className='flex flex-col gap-3 justify-center h-lvh items-center w-screen'>
            <h1 className='font-bold text-5xl'>Coming Soon</h1>
            <Link href={'/artworks'} className='btn btn-neutral rounded-sm text-xl'>Go to Artworks</Link>
        </div>
    )
}

export default page