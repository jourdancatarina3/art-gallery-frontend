'use client';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faPerson } from '@fortawesome/free-solid-svg-icons';

import { useAuthStore } from '@/store/auth';
import { useArtworkStore } from '@/store/artwork';
import { useBidStore } from '@/store/bid';
import Navbar from '@/components/generics/navbar';
import Footer from '@/components/generics/Footer';
import FullFullLoader from '@/components/generics/FullFullLoader';
import ArtworkCard from '@/components/artworks/ArtworkCard';
import BidsSideBarModal from '@/components/profile/BidsSideBarModal';

function ProfilePage({params}) {
    const { id } = params;
    const { user, getGalleryUser, defaultAvatarUrl } = useAuthStore();
    const { fetchArtworks } = useArtworkStore();
    const { fetchBids } = useBidStore();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [location, setLocation] = useState('');
    const [userType, setUserType] = useState('');
    const [achievements, setAchievements] = useState('');
    const [about, setAbout] = useState('');

    const [artworks, setArtworks] = useState([]);
    const [bids, setBids] = useState([]);
    const [showBids, setShowBids] = useState(false);

    const logedInUser = user;
    
    const initializeUser = (data) => {
        console.log(router, 'heree');
        setEmail(data.email);
        setUsername(data.username);
        setAvatarUrl(data.avatarUrl || defaultAvatarUrl);
        setPhoneNum(data.phone_number || '');
        setLocation(data.location || '');
        setUserType(data.user_type || 0);
        setAchievements(data.achievements || '');
        setAbout(data.about || '');

        setIsLoading(false);
    }

    const getArtworks = async () => {
        try {
            const filters = {
                artist_id: id
            }
            const res = await fetchArtworks(filters);
            setArtworks(res.objects);
        } catch (e) {
            console.error(e);
        }
    }

    const getBids = async () => {
        try {
            const filters = {
                user_id: id
            };
            const res = await fetchBids(filters);
            setBids(res);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        const setTitle = async () => {
            try {
                const res = await getGalleryUser(id);
                initializeUser(res);
                document.title = `${res.username} | FASO GALLERY`
                await Promise.all([getArtworks(), getBids()])
            } catch (e) {
                console.error(e);
                router.push('/404')
            }
        }
        setTitle();
    }, [])

    return (
        <div className='overflow-x-hidden profile-page'>
            {isLoading && <FullFullLoader />}
            <Navbar />
            <div className="flex w-full bg-gray-50">
                <main className='container mx-auto min-h-lvh font-Adamina flex gap-5 bg-white'>
                    <section className='grow flex flex-col gap-3 items-center max-w-[270px] pt-5 pb-10 rounded-b-md px-5 bg-gray-50 custom-right-shadow'>
                        <div>
                            <div className="relative flex justify-end">
                                <div className="absolute badge badge-neutral translate-x-[20%] translate-y-[40%]">
                                    {userType === 0 ? 'Artist' : 'Collector'}
                                </div>
                            </div>
                            <Image src={avatarUrl} width={150} height={150} className='rounded-full' alt="pfp" />
                        </div>
                        <div className='flex flex-col w-full gap-2 pb-3 border-dashed border-b border-black/[.3]'>
                            <p className='font-bold text-lg flex items-center gap-2'>
                                <FontAwesomeIcon icon={faPerson} className='' />
                                {username}
                            </p>
                            <p className='flex items-center gap-2'>
                                <FontAwesomeIcon icon={faEnvelope} className='' />
                                {email}
                            </p>
                            {phoneNum && (
                            <p className='flex items-center gap-2'>
                                <FontAwesomeIcon icon={faPhone} className='' />
                                {phoneNum}
                            </p>
                            )}
                            {location && (
                            <p className='flex items-center gap-2'>
                                <FontAwesomeIcon icon={faLocationDot} className='' />
                                {location}
                            </p>
                            )}
                        </div>
                        <div className='mb-3 w-full'>
                            <p className='font-bold text-lg'>About</p>
                            <pre className='w-full break-all whitespace-pre-wrap font-Adamina'>
                                {about ? about : <p className='text-sm opacity-[.7]'>No bio</p>}
                            </pre>
                        </div>
                        {achievements && (    
                        <div className='w-full'>
                            <p className='font-bold text-lg'>Achievements</p>
                            <pre className='w-full break-all whitespace-pre-wrap font-Adamina'>
                                {achievements}
                            </pre>
                        </div>
                        )}
                    </section>

                    <section className='grow flex'>
                        <div className='grow p-5'>
                            <div className='flex justify-between border-dashed border-b border-black/[.3] pb-3 mb-5'>
                                <h2 className='font-bold text-3xl flex items-center'>Artworks</h2>
                                <div className="flex gap-3">
                                    {parseInt(id) === logedInUser?.id && (
                                    <Link href={'/artworks/new'} className="btn rounded-sm text-xl">
                                        Add Artwork
                                    </Link>
                                    )}
                                    <button
                                        onClick={() => {setShowBids(true)}}
                                        className='btn btn-neutral rounded-sm text-xl'
                                    >
                                        Show Bids
                                    </button>
                                </div>
                            </div>
                            <div className='flex flex-wrap gap-8'>
                                {artworks.map((artwork) => (
                                    <ArtworkCard key={artwork.id} artwork={artwork} />
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
                {showBids && <BidsSideBarModal bids={bids} close={() => setShowBids(false)} />}
            </div>
            <Footer />
        </div>
    )
}

export default ProfilePage;