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

import { useArtworkStore } from '@/store/artwork';
import { useAuthStore } from '@/store/auth';
import { formatDate } from '@/utils/dateTime'
import { Router } from "next/router";

const LAPTOP_SCREEN = 1024;

export default function Home() {
  const { fetchArtworks, fetchTopArtist, fetchFeaturedArtworks } = useArtworkStore();
  const { defaultAvatarUrl } = useAuthStore();
  const router = useRouter();
  const featureContainer = useRef(null);

  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(true);
  const [artworks, setArtworks] = useState([]);
  const [topArtist, setTopArtist] = useState([]);
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [featureContWidth, setFeatureContWidth] = useState(0);
  const [ratio, setRatio] = useState(9/16)
  const featureContHeight = featureContWidth * ratio;
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isSmallScreen, setIsSmallScreen] = useState(false)

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
    moveFeatureIndex();
  }, [featureIndex])

  useEffect(() => {
    featureContainer.current.style.height = `${featureContHeight}px`;
  }, [featureContWidth])
  
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
    if (featureContainer.current) {
      setFeatureContWidth(featureContainer.current.offsetWidth);
    }
    const handleResize = () => {
      if (featureContainer.current) {
        setFeatureContWidth(featureContainer.current.offsetWidth);
      }
    }
    window.addEventListener('resize', handleResize);
    
    getFeaturedArtworks();
    const artworksFilters = {
      bottom: 10,
      order_by: '-viewers_count',
      status: 0, // for sale
      // created_on__gte: formatDate(new Date(new Date().setDate(new Date().getDate() - 7))),
    }
    getArtworks(artworksFilters);
    fetchTopArtist().then(artist => setTopArtist(artist));

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className="overflow-x-hidden home-page">
    {isLoadingFeatured && <FullFullLoader />}
    <Navbar showSearch={true} />
    <main className="min-h-screen pb-72 font-Adamina">
      <div className="container max-w-[1536px] mx-auto">
        <div className="w-full flex flex-col items-center">
          <div className="flex w-full">
            <div className="relative inline-block w-full feature-container" ref={featureContainer}>
              <Image src={featuredArtworks[featureIndex]?.image_url || defaultAvatarUrl} alt='Featured Artwork' layout="fill" objectFit="cover"/>
            </div>
            <div className="relative">
              <div className="absolute right-0 h-full flex flex-col justify-center">
                <div className="flex flex-col gap-2 w-[300px] my-auto mr-3 text-white">
                  <h1 className="text-3xl font-bold mb-3 flex items-center gap-2">
                    <div className="w-2 h-8 bg-slate-600"></div>
                    <span className="shadow-md-no-off">{featuredArtworks[featureIndex]?.artwork.title}</span>
                  </h1>
                  <p className="shadow-md-no-off">
                    Artist: {featuredArtworks[featureIndex]?.artwork.artist.username}
                  </p>
                  <p className="shadow-md-no-off">
                    {featuredArtworks[featureIndex]?.artwork.current_highest_bid ? (
                      <>
                        Highest Bid: ₱ {featuredArtworks[featureIndex]?.artwork.current_highest_bid}
                      </>
                    ) : (
                      <>
                        Starting Bid: ₱ {featuredArtworks[featureIndex]?.artwork.starting_bid || '0'}
                      </>
                    )}
                  </p>
                  {featuredArtworks[featureIndex]?.artwork.bids_count > 0 && (
                    <p className="shadow-md-no-off">
                      {featuredArtworks[featureIndex]?.artwork.bids_count} Bid{featuredArtworks[featureIndex]?.artwork.bids_count > 1 && 's'}
                    </p>
                  )}
                  <Link href={`/artworks/${featuredArtworks[featureIndex]?.artwork.slug}?prev=true`} className="flex items-center gap-2 btn rounded-sm w-max">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    More Info
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute bottom-0 mb-3 text-white w-max bg-slate-400/[.3] rounded-full flex items-center gap-2 px-2">
              {featuredArtworks.map((_, index) => (
                <p key={index}>
                  {featureIndex === index ? <span>●</span> : <span>○</span>}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-4xl font-black mb-3 flex items-center gap-2">
            <div className="w-2 h-10 bg-slate-600"></div>
            Popular artworks this week
          </h2>
          <div className="flex gap-3 pb-3 overflow-x-auto overflow-y-hidden">
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
                <div className="relative translate-x-[-12%]">
                  <ArtworkCard artwork={art} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-4xl font-black mb-3 flex items-center gap-2">
            <div className="w-2 h-10 bg-slate-600"></div>
            Popular month this month
          </h2>
          <div className="flex gap-10 overflow-x-auto">
            {topArtist.map((artist, index) => (
              <div key={index} className="min-w-[300px] pb-5">
                <div className="relative h-[300px]">
                  <Image onClick={() => {router.push(`/user/${artist.id}`)}} src={artist.avatar_url || defaultAvatarUrl} alt='Artist Profile' layout="fill" objectFit="cover" className="rounded-full cursor-pointer" />
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
