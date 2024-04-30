import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='w-screen py-6'>
      <div className='flex w-5/6 m-auto justify-between'>
        <h1 className='text-2xl font-semibold'>FASO | GALLERY</h1>
        <div className='bg-gray-300 py-3 flex rounded'>
          <div className='px-4'>
            <FontAwesomeIcon icon={faMagnifyingGlass} width={20} height={20} />
          </div>
          <input className='focus placeholder-gray-700 focus:outline-none bg-gray-300' placeholder='Search Artwork' />
        </div>

        <button><Link href='/' className=''>Home</Link></button>
        <button><Link href='/' className=''>Artworks</Link></button>
        <button><Link href='/' className=''>Bids</Link></button>
        <button><Link href='/' className=''>Sign up</Link></button>
        <button><Link href='/' className=''>Login</Link></button>
      </div>
    </div>
  )
}

export default Header