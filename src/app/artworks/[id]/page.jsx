"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/generics/navbar';
import Footer from '@/components/generics/Footer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useArtworkStore } from '@/store/artwork';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'next/navigation';

import FullLoader from '@/components/generics/FullLoader';
import ArtworkDeleteModal from '@/components/artworks/ArtworkDeleteModal';
import AddBidModal from '@/components/artworks/AddBidModal';
import BidsModal from '@/components/artworks/BidsModal';
import { useAuthStore } from '@/store/auth';

const SingleArtworkPage = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prevPath = searchParams.get('prev');
  const { user, getUser } = useAuthStore();
  const { fetchArtwork, defaultAvatarUrl, deleteArtwork } = useArtworkStore();

  const { id: slug } = params;
  const [artwork, setArtwork] = useState(null);
  const [isLoadingArtwork, setIsLoadingArtwork] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const artworkId = slug.split('-').shift();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [showAddBidModal, setShowAddBidModal] = useState(false);

  const isArtworkArtist = user?.id === artwork?.artist.id;

  const removeArtwork = async () => {
    setShowDeleteModal(false);
    setIsLoadingArtwork(true);
    try {
      const user = await getUser();
      if (user.id !== artwork.artist.id) {
        return;
      }
      await deleteArtwork(artwork.id);
      router.push('/artworks');
    } catch (error) {
      console.error('Error fetching user:', error);
    }
    setIsLoadingArtwork(false);
  }

  const fetchArtworkById = async () => {
    try {
      setIsLoadingArtwork(true);
      const data = await fetchArtwork(artworkId);
      setArtwork(data);
      document.title = `${data.title} | FASO Gallery`;
    } catch (error) {
      console.error('Error fetching artwork:', error);
    } finally {
      setIsLoadingArtwork(false);
    }
  };

  useEffect(() => {
    fetchArtworkById();
  }, []);

  const handleEmailClick = () => {
    const artworkTitle = artwork ? artwork.title : '';
    const message = `Hi there,\n\nI'm interested in buying your artwork "${artworkTitle}". Please provide me with more details on how we can arrange the deal.\n\nRegards,`;
    const encodedMessage = encodeURIComponent(message);
    const mailtoLink = `mailto:${artwork.artist.email}?subject=Interested in your artwork "${artworkTitle}" &body=${encodedMessage}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className='overflow-x-hidden'>
      <Navbar className="fixed left-0 top-0" />
      {isLoadingArtwork ? <FullLoader /> : (  
      <div className='mt-7 container mx-auto min-h-lvh'>
        <div className="flex justify-between items-center w-full">
          <div className='flex gap-3 mt-3 font-light'>
            <Link href='/'>Home</Link>
            <h1>/</h1>
            <Link href='/artworks'>Artworks</Link>
            <h1>/</h1>
            {artwork && <h1 className='font-semibold'>{artwork.title}</h1>}
          </div>

          <div className='flex items-center gap-3'>
            {isArtworkArtist && (
              <div className='flex gap-3'>
                <FontAwesomeIcon onClick={() => setShowDeleteModal(true)} icon={faTrash} className='h-[25px] cursor-pointer text-error' />
                <FontAwesomeIcon onClick={() => router.push(`/artworks/${artwork.slug}/edit`)} icon={faPenToSquare} className='h-[25px] cursor-pointer text-success' />
              </div>
            )}
            {prevPath && (
            <FontAwesomeIcon
                onClick={() => window.history.back()} icon={faClose}
                className='text-3xl h-[30px] cursor-pointer'
            />
            )}
          </div>
        </div>

        <div className='w-full h-auto flex flex-wrap justify-center mt-20 gap-10'>
          <div className='flex gap-6'>
            <div className="min-w-[400px]">
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

            <div className='flex flex-col justify-between'>
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
          </div>

          <div className='w-[300px] flex flex-col justify-between grow border-2 border-solid p-12 font-Adamina'>
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

                {artwork?.category && (
                  <h1 className='text-gray-600 text-md capitalize'>{artwork.category.name}</h1>
                )}
                <div className='flex flex-col gap-3 overflow-y-scroll h-52'>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
              </div>
            </div>
            <div className='flex flex-row flex-wrap gap-3 mt-3'>
              <button
                onClick={() => setShowAddBidModal(true)}
                disabled={isArtworkArtist}
                className={`grow px-5 text-center bg-gray-300 rounded-sm text-center text-black font-bold py-3 ${isArtworkArtist && 'cursor-not-allowed'}`}
              >
                ADD A BID
              </button>
              <button
                onClick={() => setShowBidsModal(true)}
                className='grow px-5 text-center btn btn-neutral rounded-sm text-center font-bold py-3'>
                SHOW BIDS
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
      {showDeleteModal && <ArtworkDeleteModal setShowDeleteModal={setShowDeleteModal} deleteArtwork={removeArtwork} />}
      {showBidsModal && <BidsModal setShowBidsModal={setShowBidsModal} artworkId={artworkId} setShowAddBidModal={setShowAddBidModal} artistId={artwork.artist.id} />}
      {showAddBidModal && <AddBidModal setShowAddBidModal={setShowAddBidModal} setShowBidsModal={setShowBidsModal} artworkId={artworkId}/>}
      <Footer />
    </div>
  );
};

export default SingleArtworkPage;
