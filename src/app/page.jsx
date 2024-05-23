'use client';

import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "@/components/generics/navbar";
import ArtworkCard from "@/components/artworks/ArtworkCard";
import BaseLoading from "@/components/generics/BaseLoading";
import Footer from "@/components/generics/Footer";
import FullFullLoader from "@/components/generics/FullFullLoader";
import { Carousel } from '@material-tailwind/react';
import { useArtworkStore } from '@/store/artwork';
import { useAuthStore } from '@/store/auth';
import { formatDate } from '@/utils/dateTime'
import { Router } from "next/router";

const LAPTOP_SCREEN = 1024;

export default function Home() {
  const { fetchArtworks, fetchTopArtist, fetchFeaturedArtworks } = useArtworkStore();
  const { defaultAvatarUrl } = useAuthStore();
  const router = useRouter();

  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(true);
  const [artworks, setArtworks] = useState([]);
  const [topArtist, setTopArtist] = useState([]);
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [featureContWidth, setFeatureContWidth] = useState(0);
  const [ratio, setRatio] = useState(9/16)
  const featureContHeight = featureContWidth * ratio;
  const [screenWidth, setScreenWidth] = useState();
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  const featuredArtwork = featuredArtworks[featureIndex];
  const featuredArtworkImage = !isSmallScreen ? (featuredArtwork?.image_url || defaultAvatarUrl) 
    : featuredArtwork?.artwork?.first_image.image_url || defaultAvatarUrl;

  const getFeaturedArtworks = async () => {
    setIsLoadingFeatured(true);
    const data = await fetchFeaturedArtworks();
    setFeaturedArtworks(data);
    setIsLoadingFeatured(false);
  }

  const getArtworks = async (filters) => {
    setIsLoadingArtworks(true);
    const data = await fetchArtworks(filters);
    setArtworks(data.objects);
    setIsLoadingArtworks(false);
  }

  const moveFeatureIndex = () => {
    setTimeout(() => {
      if (featureIndex === featuredArtworks.length - 1) {
        setFeatureIndex(0);
      } else {
        setFeatureIndex(featureIndex + 1);
      }
    
    }, 5000)
  }

  useEffect(() => {
  }, [featureIndex])
  moveFeatureIndex();
  
  useEffect(() => {
    if (screenWidth < LAPTOP_SCREEN) {
      setIsSmallScreen(true);
      setRatio(4/3);
    } else {
      setIsSmallScreen(false);
      setRatio(9/16);
    }
  }, [screenWidth])

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    function handleResize() {
        setScreenWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
},[])

  useEffect(() => {
    getFeaturedArtworks();
    const artworksFilters = {
      bottom: 10,
      order_by: '-viewers_count',
      status: 0, // for sale
      // created_on__gte: formatDate(new Date(new Date().setDate(new Date().getDate() - 7))),
    }
    getArtworks(artworksFilters);
    fetchTopArtist().then(artist => setTopArtist(artist));

  }, []);
  return (
    <div className="overflow-x-hidden home-page">
    {isLoadingFeatured && <FullFullLoader />}
    <div className="fixed z-30">
      <Navbar showSearch={true} />
    </div>
    <main className="min-h-screen pb-72 font-Adamina">
      <div className="container max-w-[1536px] mx-auto">
        {!isLoadingArtworks && (
        <div className="w-full h-lvh pt-[75px] sm:h-[925px]">
          <Carousel
            autoplay 
            loop
            className="rounded-sm"
            navigation={({ setActiveIndex, activeIndex, length }) => (
              <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                {new Array(length).fill("").map((_, i) => (
                  <span
                    key={i}
                    className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                      activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                    }`}
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            )}
          >
            {featuredArtworks.map((artwork, index) => (
              <div key={index} className="w-full h-full flex flex-col">
                <div className="relative">
                  <div className="absolute m-5 text-white flex flex-col gap-2">
                    <h1 className="text-2xl font-medium flex items-stretch gap-2">
                      <div className="w-2 bg-slate-700"></div>
                      <span className="shadow-md-no-off">{artwork.artwork.title}</span>
                    </h1>
                    <div className="pl-5 flex flex-col gap-1">
                      <p className="shadow-md-no-off">
                        Artist: {artwork.artwork.artist.username}
                      </p>
                      <p className="shadow-md-no-off">
                        {artwork.artwork.current_highest_bid ? (
                          <>
                            Highest Bid: ₱ {artwork.artwork.current_highest_bid}
                          </>
                        ) : (
                          <>
                            Starting Bid: ₱ {artwork.artwork.starting_bid || '0'}
                          </>
                        )}
                      </p>
                      {artwork.artwork.bids_count > 0 && (
                        <p className="shadow-md-no-off">
                          {artwork.artwork.bids_count} Bid{artwork.artwork.bids_count > 1 && 's'}
                        </p>
                      )}
                      <Link href={`/artworks/${artwork.artwork.slug}?prev=true`} className="flex items-center gap-2 btn btn-ghost p-0 rounded-sm w-max shadow-md-no-off">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        More Info
                      </Link>
                    </div>
                  </div>
                </div>

                <img
                  src={!isSmallScreen ? artwork.image_url || defaultAvatarUrl : artwork.artwork?.first_image.image_url || defaultAvatarUrl}
                  alt="image 1"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </Carousel>
        </div>
        )}

        <div className="mt-10 px-3">
          <h2 className="text-4xl font-black mb-3 flex items-stretch gap-2">
            <div className="w-2 min-w-2 bg-slate-600"></div>
            <span className="mr-2">
              Top artworks this for sale this week
            </span>
            <Link href="/artworks" className="grow whitespace-nowrap text-base self-end text-gray-500 hover:text-sky-300 transition duration-200">View all &gt;</Link>
          </h2>
          <div className="flex gap-3 pb-3 overflow-x-auto snap-mandatory snap-x overflow-y-hidden">
            {isLoadingArtworks && (
              <>
                {[...Array(6)].map((_, index) => (
                  <div className="min-w-[350px] max-w-[350px] pb-5" key={index}>
                    <BaseLoading width={350} height={467} />
                  </div>
                ))}
              </>
            )  
            }
            {artworks.map((art, index) => (
              <div key={index} className="flex">
                <div className="h-[500px] overflow-y-hidden">
                  <p className="font-kumar text-[400px] h-max text-gray-700">{index + 1}</p>
                </div>
                <div className="relative w-[270px]">
                  <div className="absolute translate-x-[-12%] snap-center">
                    <ArtworkCard artwork={art} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 px-3">
        <h2 className="text-4xl font-black mb-3 flex items-stretch gap-2">
            <div className="w-2 min-w-2 bg-slate-600"></div>
            <span className="mr-2">
              Popular artists this month
            </span>
            <Link href="/artworks" className="grow whitespace-nowrap text-base self-end text-gray-500 hover:text-sky-300 transition duration-200">View all &gt;</Link>
          </h2>
          <div className="flex gap-10 overflow-x-auto snap-mandatory snap-x">
            {topArtist.map((artist, index) => (
              <div key={index} className="min-w-[300px] pb-5">
                <div className="relative h-[300px]">
                  <Image onClick={() => {router.push(`/user/${artist.id}`)}} src={artist.avatar_url || defaultAvatarUrl} alt='Artist Profile' layout="fill" objectFit="cover" className="rounded-full cursor-pointer snap-center" />
                </div>
                  <h3 className="text-lg font-semibold text-center mt-3">{artist.username}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
    {!isLoadingFeatured && (
    <Footer />
    )}
    </div>
  );
}
