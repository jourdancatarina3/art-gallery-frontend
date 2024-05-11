'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';

import Navbar from "@/components/generics/navbar";
import ArtworkCard from "@/components/artworks/ArtworkCard";
import BaseLoading from "@/components/generics/BaseLoading";
import Footer from "@/components/generics/Footer";

import { useArtworkStore } from '@/store/artwork';
import { useAuthStore } from '@/store/auth';
import { formatDate } from '@/utils/dateTime'

// TODO: Add base loader when fetching
export default function Home() {
  const { fetchArtworks, fetchTopArtist, fetchFeaturedArtworks } = useArtworkStore();
  const { defaultAvatarUrl } = useAuthStore();

  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(true);
  const [artworks, setArtworks] = useState([]);
  const [topArtist, setTopArtist] = useState([]);
  const [featuredArtworks, setFeaturedArtworks] = useState([]);

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

  useEffect(() => {
    getFeaturedArtworks();
    getArtworks({bottom: 10});
    fetchTopArtist().then(artist => setTopArtist(artist));
  }, []);
  return (
    <>
    <div className="overflow-x-hidden">
      <Navbar showSearch={true} />
    </div>
    <main className="min-h-screen pb-72 font-Adamina overflow-x-hidden">
      <div className="container xl w-5/6 mx-auto">
        <div className="mt-5">
          <h1 className="font-inter text-5xl">Featured Artwork</h1>
          <div className="flex gap-7 mt-8">
            <div className="w-2/3">
              <div className="relative h-[30rem] overflow-hidden">
                {isLoadingFeatured ? <BaseLoading width={1000} height={500}/> :
                  <Image
                    src={featuredArtworks[0]?.first_image?.image_url || defaultAvatarUrl}
                    alt="art pic"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-sm"
                  />
                }
              </div>
            </div>
            <div className="w-1/3 overflow-hidden">
              {isLoadingFeatured ? (
                <div className="flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-3">
                    <BaseLoading width={300} height={70} />
                    <BaseLoading width={500} height={250} />
                  </div>
                  <BaseLoading width={200} height={70} />
                </div>
              ):
              (
                <>
                  <h1 className="text-4xl font-semibold">{featuredArtworks[0]?.title || 'The Starry Night'}</h1>
                  <h2 className="mt-2 font-light">Artist: {featuredArtworks[0]?.artist?.username || 'Yurim'}</h2>
                  <h2 className="font-light">Date: {formatDate(featuredArtworks[0]?.created_on || null)}</h2>
                  <pre className="mt-5 text-lg max-h-[400px] overflow-hidden line-clamp-6 font-Adamina" style={{ whiteSpace: 'pre-wrap' }}>
                    {featuredArtworks[0]?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                  </pre>
                  <h2 className="mt-2 text-xl font-bold">
                  Current Bid: ${featuredArtworks[0]?.current_highest_bid || featuredArtworks[0]?.starting_bid || 0}
                  </h2>
                  <div className="flex gap-5 mt-3">
                    <button className="bg-neutral px-8 py-2 text-lg text-white rounded-sm">Bid Now</button>
                    <button className="text-lg">Learn More...</button>
                  </div>
                </>
              )
              }
            </div>
          </div>
        </div>

        <div className="mt-32">
          <h1 className="font-inter text-5xl mb-8">New<br />Artworks</h1>
          <div className="flex gap-5 pb-3 overflow-x-auto">
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
              <ArtworkCard key={index} artwork={art} />
            ))}
          </div>
        </div>

        <div className="mt-32">
          <h1 className="font-inter text-5xl mb-8">Popular Artists</h1>
          <div className="flex gap-10 overflow-x-auto">
            {topArtist.map((artist, index) => (
              <div key={index} className="min-w-[300px] pb-5">
                <div className="relative h-[300px]">
                  <Image src={artist.avatar_url || defaultAvatarUrl} alt='Artist Profile' layout="fill" objectFit="cover" className="rounded-full" />
                </div>
                  <h3 className="text-lg font-semibold text-center mt-3">{artist.username}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
