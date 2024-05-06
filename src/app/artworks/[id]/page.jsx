"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/generics/navbar';
import Link from 'next/link';
import Image from 'next/image';
import { useArtworkStore } from '@/store/artwork';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const SingleArtworkPage = ({ params }) => {
  const { id: artworkId } = params;
  const { fetchArtwork, defaultAvatarUrl } = useArtworkStore();
  const [artwork, setArtwork] = useState(null);
  const [isLoadingArtwork, setIsLoadingArtwork] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  useEffect(() => {
    const fetchArtworkById = async () => {
      try {
        setIsLoadingArtwork(true);
        const data = await fetchArtwork(artworkId);
        setArtwork(data);
      } catch (error) {
        console.error('Error fetching artwork:', error);
      } finally {
        setIsLoadingArtwork(false);
      }
    };

    fetchArtworkById();
  }, [artworkId, fetchArtwork]);

  const handleEmailClick = () => {
    const artworkTitle = artwork ? artwork.title : '';
    const message = `Hi there,\n\nI'm interested in buying your artwork "${artworkTitle}". Please provide me with more details on how we can arrange the deal.\n\nRegards,`;
    const encodedMessage = encodeURIComponent(message);
    const mailtoLink = `mailto:${artwork.artist.email}?subject=Interested in your artwork "${artworkTitle}" &body=${encodedMessage}`;
    window.open(mailtoLink, '_blank');
  };
 

  console.log("ARTWORK: ", artwork)

  return (
    <div>
      {!isLoadingArtwork ? (
        <div>
          <Navbar />
          <div className='w-5/6 mx-auto min-h-screen'>
            <div className='flex gap-3 mt-3 font-light'>
              <Link href='/'>Home</Link>
              <h1>/</h1>
              <Link href='/artworks'>Artworks</Link>
              <h1>/</h1>
              {artwork && <h1 className='font-semibold'>{artwork.title}</h1>}
            </div>

            <div className='w-3/4 mx-auto h-auto flex mt-20'>
              <div className="min-w-[477.1px]">
                {artwork && (
                  <div className="relative h-[569.4px]">
                    <Image
                      src={artwork.first_image?.image_url || defaultAvatarUrl}
                      alt={artwork.title}
                      layout="fill"
                      objectFit="cover"
                      className=""
                    />
                  </div>
                )}
              </div>

              <div className='mx-14 flex flex-col justify-between'>
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className='min-w-[83.2px] cursor-pointer'
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(selectedImageIndex)}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    {artwork && (
                      <div className="relative h-[101.5px]">
                        <Image
                          src={artwork.first_image?.image_url || defaultAvatarUrl}
                          alt={artwork.title}
                          layout="fill"
                          objectFit="cover"
                          className={`${
                            ( index === hoveredIndex || (hoveredIndex === -1 && index === 0))
                              ? 'opacity-100'
                              : 'opacity-35'
                          } transition-opacity duration-300`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className='grow border-2 border-solid p-12 font-Adamina'>
                <div>
                <div className='flex flex-col gap-3'>
                  <h1 className='font-bold text-md'>{artwork.title}</h1>
                  <h1 className='font-bold text-md'>Current Bid: ${artwork.starting_bid}</h1>
                  <div className='flex justify-between items-center'>
                     <h1 className='text-gray-600 text-md capitalize'>Artist: {artwork.artist.first_name} {artwork.artist.last_name}</h1>
                     <a href={`mailto:${artwork.artist.email}`} onClick={handleEmailClick} target='_blank'>
                       <FontAwesomeIcon icon={faEnvelope} className='text-2xl cursor-pointer' />
                     </a>
                   </div>

                  
                  <h1 className='text-gray-600 text-md capitalize'>{artwork.category.name}</h1>
                  <div className='flex flex-col gap-3 overflow-y-scroll h-52'>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </div>
                </div>
                </div>
                <div className='flex flex-col gap-1 mt-3'>
                  <button className='w-full text-center bg-gray-300 text-center text-black font-bold py-3'>ADD A BID</button>
                  <button className='w-full text-center bg-black text-white text-center font-bold py-3'>SHOW BIDS</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading artwork...</p>
      )}
    </div>
  );
};

export default SingleArtworkPage;
