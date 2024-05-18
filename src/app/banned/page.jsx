import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

function page() {
    return (
        <div className='flex justify-center items-center h-lvh font-Adamina'>
            <div className="flex flex-col items-center gap-3">
                <Image src='/images/favicon.svg' width={100} height={100} alt="logo" />
                <h1 className='text-4xl font-bold'>You are banned</h1>
                <p className='text-lg text-center'>Please contact support for more information</p>
                <a className='flex gap-2 items-center' href="mailto:fasogallery@gmail.com" target='_blank'>
                    <FontAwesomeIcon icon={faEnvelope} width={20} height={20} className='text-xl' />
                    <span>fasogallery@gmail.com</span>
                </a>
                <Link href={'/artworks'} className='btn btn-neutral rounded-sm'>
                    Go to artworks
                </Link>
            </div>
        </div>
    )
}

export default page