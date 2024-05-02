'use client';

import Image from 'next/image'
import { useEffect } from 'react'

const ArtworkCard = (props) => {
  const { artwork } = props;
  const price = parseFloat(artwork.current_highest_bid || artwork.starting_bid || 0);

  useEffect(() => {
    console.log(artwork, 'card here');
  },[]);

  return (
    <div className="min-w-[350px] max-w-[350px] pb-5">
      <div className="relative h-[467px] overflow-hidden">
        <Image src={artwork.first_image.image_url} alt={artwork.title} layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 transform-gpu scale-100 hover:scale-105 cursor-pointer" />
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