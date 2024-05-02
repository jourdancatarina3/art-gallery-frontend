"use client"

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react'
import { ArtDataContext, useArtData, useArtDataContext } from '../context/ArtDataContext';
import Image from 'next/image';

const artGenres = [
  "Abstract",
  "Impressionism",
  "Expressionism",
  "Surrealism",
  "Realism",
  "Cubism",
  "Renaissance",
  "Modernism"
];

const ArtworksPage = () => {
  const artData = useArtDataContext();

  return (
    <div className='w-5/6 mx-auto'>
      <div className='flex gap-3 font-light'>
        <h1>Home</h1>
        <h1>/</h1>
        <h1 className='font-semibold'>Artworks</h1>
      </div>
      <div className='flex'>
        <div className='w-[20%]'>
          <h1 className='text-2xl font-semibold mt-20'>Filters</h1>
          <hr className="border-0 h-px bg-gray-300 my-5" />
          <div className='flex flex-col gap-5'>
            <h1></h1>
            {artGenres.map((genre) => (
              <div className='flex gap-3 items-center'>
                <input type='checkbox' className='w-5 h-5' />
                <h1 className='text-xl tracking-widest'>{genre} (18) </h1>
              </div>
            ))}
          </div>
        </div>
        <div className='mt-5 ml-10 w-[80%]'>
          <h1 className='text-3xl font-semibold'>ARTWORKS</h1>
          <div className='bg-gray-200 py-3.5 flex rounded mt-2 w-96'>
            <div className='px-4 cursor-pointer'>
              <FontAwesomeIcon icon={faMagnifyingGlass} width={20} height={20} />
            </div>
            <input className='focus placeholder-gray-700 focus:outline-none bg-gray-200 w-96' placeholder='Search Artwork' />
          </div>
          <div className='mt-10 grid grid-cols-3 gap-5 flex-wrap'>
          {artData.map((art, index) => (
              <div key={index} className="min-w-[335.5px] pb-5">
                <div className="relative h-[344.3px]">
                  <Image src={art.url} alt={art.title} layout="fill" objectFit="cover" className="rounded-md" />
                </div>
                <div className="flex justify-between mt-1.5">
                  <h3 className="text-gray-600 font-light">{art.artist}</h3>
                  <h3 className="text-gray-600 font-light">{art.type}</h3>
                </div>
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold">{art.title}</h3>
                  <h3 className="text-lg font-semibold">${art.price}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtworksPage
