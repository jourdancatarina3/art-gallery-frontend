"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/generics/navbar';
import Footer from '@/components/generics/Footer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { useSearchParams } from 'next/navigation';

import FullLoader from '@/components/generics/FullLoader';
import ArtworkDeleteModal from '@/components/artworks/ArtworkDeleteModal';
import AddBidModal from '@/components/artworks/AddBidModal';
import BidsModal from '@/components/artworks/BidsModal';
import { useArtworkStore } from '@/store/artwork';
import { useAuthStore } from '@/store/auth';

const SingleArtworkPage = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prevPath = searchParams.get('prev');
  const { user, getUser, defaultAvatarUrl } = useAuthStore();
  const { fetchArtwork, deleteArtwork, updateArtwork } = useArtworkStore();

  const { id: slug } = params;
  const [artwork, setArtwork] = useState(null);
  const [isLoadingArtwork, setIsLoadingArtwork] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const artworkId = slug.split('-').shift();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [showAddBidModal, setShowAddBidModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const isArtworkArtist = user?.id === artwork?.artist.id;
  const price = parseFloat(artwork?.current_highest_bid || artwork?.starting_bid || 0);

  const disableAddBid = isArtworkArtist || artwork?.status !== 0;

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
      setSelectedImage(data.first_image?.image_url);
    } catch (error) {
      console.error('Error fetching artwork:', error);
    } finally {
      setIsLoadingArtwork(false);
    }
  };

  const changeToSold = async () => {
    try {
      setIsLoadingArtwork(true);
      const data = {...artwork, status: 1, artist_id: artwork.artist.id};
      await updateArtwork(artwork.id, data);
      await fetchArtworkById();
    } catch (error) {
      console.error('Error updating artwork:', error);
    } finally {
      setIsLoadingArtwork(false);
    }
  
  }

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

  const handleImageClick = (index) => {
    const selectedImageUrl = artwork.images[index]?.image_url || defaultAvatarUrl;
    setSelectedImage(selectedImageUrl);
    setSelectedImageIndex(index);
  };
  

  console.log("ARTWORK: ", selectedImage)

  return (
    <div className='overflow-x-hidden'>
      <Navbar className="fixed left-0 top-0" />
      {isLoadingArtwork ? <FullLoader /> : (  
      <div className=' py-5 container mx-auto min-h-lvh font-Adamina'>
        <div className="flex justify-between items-center w-full">
          <div className='flex gap-3 mt-3 font-light'>
            <Link href='/'>Home</Link>
            <h1>/</h1>
            <Link href='/artworks'>Artworks</Link>
            <h1>/</h1>
            {artwork && <h1 className='font-semibold'>{artwork.title}</h1>}
          </div>

          <div className='flex items-center gap-3'>
            {isArtworkArtist && artwork.status === 0 && artwork?.current_highest_bid && (
              <button 
                onClick={() => changeToSold()}
                className='btn btn-neutral rounded-sm text-xl font-medium'
              >
                Sell Artwork
              </button>
            )}
            {isArtworkArtist && (
              <div className='flex gap-3'>
                {artwork.status === 0 ? (
                  <FontAwesomeIcon onClick={() => router.push(`/artworks/${artwork.slug}/edit`)} icon={faPenToSquare} className='h-[25px] cursor-pointer text-success' />
                ):
                (
                  <FontAwesomeIcon icon={faComment} className='h-[25px] cursor-pointer' />
                )}
                <FontAwesomeIcon onClick={() => setShowDeleteModal(true)} icon={faTrash} className='h-[25px] cursor-pointer text-error' />
              </div>
            )}
            {prevPath && (
            <FontAwesomeIcon
                onClick={() => router.back()} icon={faClose}
                className='text-3xl h-[30px] cursor-pointer'
            />
            )}
          </div>
        </div>

        <div className='w-full h-auto flex flex-wrap justify-center mt-20 gap-10'>
          <div>
            <div className='flex gap-6'>
              <div className="min-w-[400px]">
                {artwork && (
                  <div className="relative h-[569.4px]">
                    <Image
                      src={selectedImage || defaultAvatarUrl}
                      alt={artwork.title}
                      layout="fill"
                      objectFit="cover"
                      className=" shadow-md"
                    />
                  </div>
                )}
              </div>

              <div className='flex flex-col justify-start gap-3'>
                {artwork.images.map((image, index) => (
                  <div
                    key={index}
                    className='min-w-[83.2px] cursor-pointer shadow-md'
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(selectedImageIndex)}
                    onClick={() => handleImageClick(index)}
                  >
                    {artwork && (
                      <div className="relative h-[101.5px]">
                        <Image
                          src={image.image_url || defaultAvatarUrl}
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

            <div className='flex justify-between items-center mt-5 px-5 py-3 border border-gray-300 rounded-md'>
                <div className="flex gap-3 items-center">
                  <Image
                    onClick={() => {router.push(`/user/${artwork.artist.id}`)}}
                    src={artwork.artist.avatar_url || defaultAvatarUrl} width={40} height={40} alt="pfp" 
                    className='cursor-pointer'
                    style={{ 
                          width: '40px', 
                          height: '40px', 
                          objectFit: 'cover', 
                          borderRadius: '50%',
                      }}
                  />
                  <div className="flex flex-col">
                    <Link href={`/user/${artwork.artist.id}`} className='text-md capitalize'>{artwork.artist.username}</Link>
                    <span className='text-xs text-gray-600'>10k followers</span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <a href={`mailto:${artwork.artist.email}`} onClick={handleEmailClick} target='_blank'>
                    <FontAwesomeIcon icon={faEnvelope} className='text-2xl cursor-pointer' />
                  </a>
                  <button className='btn rounded-full'>
                    Folow
                  </button>
                </div>
            </div>
          </div>

          <div className='w-[300px] flex flex-col justify-between grow border-2 border-solid px-10 py-7 font-Adamina rounded-md'>
            <div>
              <div className='flex flex-col gap-3'>
                <div className="flex justify-between">
                  <h1 className='font-bold text-2xl'>{artwork.title}</h1>
                  <button>
                    <FontAwesomeIcon icon={faHeart} className='text-2xl cursor-pointer' />
                  </button>
                </div>
                <h1 className='font-bold text-xl py-3 px-4 bg-gray-100'>{artwork.current_highest_bid? 'Highest': 'Starting'} Bid: ₱ {price}</h1>

                {artwork?.category && (
                  <h1 className='text-gray-600 text-md capitalize'>Category: {artwork.category.name}</h1>
                )}
                <pre className='w-full break-all whitespace-pre-wrap font-Adamina max-h-[400px] overflow-y-auto'>
                  {artwork.description}
                </pre>
              </div>
            </div>
            <div className='flex flex-row flex-wrap gap-3 mt-3'>
              <button
                onClick={() => {
                  if (!user) {
                    router.push(`/login?redirect=/artworks/${artwork.slug}`);
                    return;
                  }
                  setShowAddBidModal(true)
                }}
                disabled={disableAddBid}
                className={`grow px-5 text-center bg-gray-300 rounded-sm text-center text-black font-bold py-3 ${disableAddBid && 'cursor-not-allowed'}`}
              >
                {artwork.status === 0 ? 'BID NOW' : 'RESERVED'}
              </button>
              <button
                onClick={() => setShowBidsModal(true)}
                className='grow px-5 text-center btn btn-neutral rounded-sm text-center font-bold py-3'>
                SHOW BIDS
                <div className="badge">{artwork.bids_count}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
      {showDeleteModal && <ArtworkDeleteModal setShowDeleteModal={setShowDeleteModal} deleteArtwork={removeArtwork} />}
      {showBidsModal && <BidsModal setShowBidsModal={setShowBidsModal} artwork={artwork} setShowAddBidModal={setShowAddBidModal} />}
      {showAddBidModal && <AddBidModal setShowAddBidModal={setShowAddBidModal} setShowBidsModal={setShowBidsModal} artwork={artwork}/>}
      <Footer />
    </div>
  );
};

export default SingleArtworkPage;
