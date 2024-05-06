import Navbar from '@/components/generics/navbar'
import RegisterPane from '@/components/auth/RegisterPane';
import React from 'react'

export const metadata = {
    title: "FASO GALLERY | Sign up",
    description: "Sign up to FASO GALLERY",
};

function page() {
    return (
        <>
        <div className='absolute top-0 left-0'>
            <Navbar />
        </div>
        <main className="flex justify-center items-center font-Adamina min-h-lvh py-10 pt-[100px]">
            <RegisterPane />
        </main>
        </>
    )
}

export default page