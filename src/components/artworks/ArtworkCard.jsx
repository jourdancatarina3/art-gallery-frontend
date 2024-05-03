'use client';

import Image from 'next/image'
import { useEffect } from 'react'

const ArtworkCard = (props) => {
  const { artwork } = props;
  const price = parseFloat(artwork.current_highest_bid || artwork.starting_bid || 0);

  const parseViewCount = (count) => {
    if (count < 1000) {
        return count;
    } else {
        return (count / 1000).toFixed(1);
    }
  }

  useEffect(() => {
    console.log(artwork, 'card here');
  },[]);

  return (
    <div className="min-w-[350px] max-w-[350px] pb-5">
      <div className="relative h-[467px] overflow-hidden">
        <Image src={artwork.first_image.image_url} alt={artwork.title} layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 transform-gpu scale-100 hover:scale-105 cursor-pointer" />
      </div>
      <div className="relative w-full flex justify-end px-2">
        <div className='absolute p-1 translate-y-[-125%] rounded flex items-center gap-1 shadow-2xl hover:bg-neutral-800 transition duration-200'>
          <p className="text-xs text-white">
            {parseViewCount(artwork.viewers_count)}
          </p>
          <div className="w-[15px] h-[15x]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#ffffff" d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/></svg>
          </div>
        </div>  
      </div>
      <div className="flex justify-between mt-1.5">
        <h3 className="text-gray-600 font-light">{artwork.artist.username}</h3>
        <h3 className="text-gray-600 font-light">{artwork.category.name}</h3>
      </div>
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">{artwork.title}</h3>
        <h3 className="text-lg font-semibold">${price}</h3>
      </div>
    </div>
  )
}

export default ArtworkCard