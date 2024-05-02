"use client";

import Navbar from '@/components/generics/navbar';
import { useArtDataContext } from '../../context/ArtDataContext';
import Link from 'next/link';
import Image from 'next/image';

const SingleArtworkPage = ({ params }) => {
  const artData = useArtDataContext();
  const { id } = params;
  
  const art = artData.find((artwork) => artwork.id === parseInt(id));

  return (
    <div>
      <Navbar />
      <div className='w-5/6 mx-auto min-h-screen'>
        <div className='flex gap-3 mt-3 font-light'>
          <Link href='/'>Home</Link>
          <h1>/</h1>
          <Link href='/artworks'>Artworks</Link>
          <h1>/</h1>
          <h1 className='font-semibold'>{art.title}</h1>
        </div>

        <div className='w-3/4 mx-auto flex mt-20'>
          <div className="min-w-[477.1px] pb-5">
            <div className="relative h-[569.4px]">
              <Image src={art.url} alt={art.title} layout="fill" objectFit="cover" className="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleArtworkPage;
