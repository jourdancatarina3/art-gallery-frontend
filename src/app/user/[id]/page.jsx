'use client';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image';
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
import FullLoader from '@/components/generics/FullLoader';
import ArtworkCard from '@/components/artworks/ArtworkCard';

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
        <div className='overflow-x-hidden'>
            {isLoading && <FullLoader />}
            <Navbar />
            <main className='container mx-auto min-h-lvh font-Adamina flex gap-5'>
                <section className='flex flex-col items-center w-[200px] min-w-[200px] pt-5 pb-10 rounded-b-md px-5 shadow-xl'>
                    <div>
                        <div className="relative flex justify-end">
                            <div className="absolute badge badge-neutral translate-x-[20%] translate-y-[40%]">
                                {userType === 0 ? 'Artist' : 'Collector'}
                            </div>
                        </div>
                        <Image src={avatarUrl} width={150} height={150} className='rounded-full' alt="pfp" />
                    </div>
                    <div className='flex flex-col gap-2 pb-3 border-dashed border-b border-black/[.3]'>
                        <p className='font-bold text-lg flex items-center gap-2'>
                            <FontAwesomeIcon icon={faPerson} className='' />
                            {username}
                        </p>
                        <p className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faEnvelope} className='' />
                            {email}
                        </p>
                        <p className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faPhone} className='' />
                            {phoneNum}
                        </p>
                        <p className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faLocationDot} className='' />
                            {location}
                        </p>
                    </div>
                    <div className='mb-3 w-full'>
                        <p className='font-bold text-lg'>About</p>
                        <pre className='w-full break-all whitespace-pre-wrap font-Adamina'>
                            {about}
                        </pre>
                    </div>
                    <div className='w-full'>
                        <p className='font-bold text-lg'>Achievements</p>
                        <pre className='w-full break-all whitespace-pre-wrap font-Adamina'>
                            {achievements}
                        </pre>
                    </div>
                </section>
                <section className='grow flex'>
                    <div className='grow py-5 px-5'>
                        <h2 className='font-bold text-xl border-dashed border-b border-black/[.3] pb-3 mb-5'>Artworks</h2>
                        <div className='flex flex-wrap gap-5'>
                            {artworks.map((artwork) => (
                                <ArtworkCard key={artwork.id} artwork={artwork} />
                            ))}
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 w-[300px] min-w-[300px] py-5 px-2 shadow-xl'>
                        <h2 className='font-bold text-xl border-dashed border-b border-black/[.3] pb-3'>Bids</h2>

                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default ProfilePage;