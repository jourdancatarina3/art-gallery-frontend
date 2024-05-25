'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useAuthStore } from '@/store/auth'
import { useArtworkStore } from '@/store/artwork'
import FullFullLoader from '@/components/generics/FullFullLoader'
import ArtworkCard from '@/components/artworks/ArtworkCard'

// TODO: Add pagination
function LikedPane() {
    const { user: storeUser, getUser } = useAuthStore()
    const { fetchLikedArtworks } = useArtworkStore()
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(true)
    const [artworks, setArtworks] = useState([])
    const [totalArtworksCount, setTotalArtworksCount] = useState(0)

    const getLikedArtworks = async () => {
        setIsLoading(true);
        try {
            let user = storeUser;
            if (!user) {
                user = await getUser();
                if (!user) {
                    router.push(`/login?redirect=/liked`);
                    return;
                }
            }
            const data = await fetchLikedArtworks(user.id);
            setArtworks(data.objects);
            setTotalArtworksCount(data.total_count);
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getLikedArtworks();
    }, [])

    return (
        <div className="container mx-auto py-5 h-lvh font-Adamina">
            {isLoading && <FullFullLoader />}
            <h1 className="text-4xl font-black mb-3 flex items-center gap-2">
                <div className="w-2 h-10 bg-slate-600"></div>
                Liked Artworks
            </h1>
            <div className="flex gap-5 flex-wrap">
                {artworks.map((item, index) => (
                    <ArtworkCard key={index} artwork={item} />
                ))}
            </div>
            {!artworks.length && (
                <div className="h-full w-full flex items-center justify-center">
                    <div className="flex flex-col gap-3">
                        <span>
                            No liked artwork
                        </span>
                        <button
                            onClick={() => router.push('/artworks')}
                            className='btn btn-neutral rounded-sm font-light'
                        >
                            Go to artworks
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LikedPane