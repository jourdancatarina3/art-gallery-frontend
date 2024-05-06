import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ArtworkCard = ({ art }) => {
  return (
    <div className="min-w-[335.5px] pb-5">
      <div className="relative h-[344.3px] overflow-hidden">
        <Link href={`/artworks/${art.id}`}>
          <Image src={art.url} alt={art.title} layout="fill" objectFit="cover" className="rounded-md transition-transform duration-300 transform-gpu scale-100 hover:scale-105 cursor-pointer" />
        </Link>
      </div>
      <div className="flex justify-between mt-1.5">
        <h3 className="text-gray-600 font-light">{art.artist}</h3>
        <h3 className="text-gray-600 font-light">{art.genre}</h3>
      </div>
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">{art.title}</h3>
        <h3 className="text-lg font-semibold">${art.price}</h3>
      </div>
    </div>
  )
}

export default ArtworkCard