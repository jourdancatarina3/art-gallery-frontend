"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'   
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPaintbrush } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import ArtworkCard from '@/components/artworks/ArtworkCard';
import BaseLoading from '@/components/generics/BaseLoading';

import { useArtworkStore } from '@/store/artwork';
import { useAuthStore } from '@/store/auth';

const ARTWORK_SIZE_PER_REQUEST = 21;

const ArtworkPane = () => {
    const { fetchArtworks, fetchCategories } = useArtworkStore();
    const { user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams()
    const paramSearchKey = searchParams.get('search');
    const top = searchParams.get('top') || 0;

    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingArtworks, setIsFetchingArtworks] = useState(false);
    const [isFetchingCategories, setIsFetchingCategories] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [artworks, setArtworks] = useState([]);
    const [totalArtworks, setTotalArtworks] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categorySearchKey, setCategorySearchKey] = useState('')

    const pageCount = Math.ceil(totalArtworks / ARTWORK_SIZE_PER_REQUEST);
    const currentPage = Math.ceil(top + 1 / ARTWORK_SIZE_PER_REQUEST)

    const initializeArtworks = async () => {
        setIsLoading(true);
        await getArtworks();
        await getCategories();
        setIsLoading(false);
    };

    const getArtworks = async () => {
        setIsFetchingArtworks(true);
        setArtworks([]);
        try {
            const filters = {
                top: top,
            };
            if (searchKey.trim().length > 0) {
                filters.search_key = searchKey;
            }
            if (selectedCategories.length > 0) {
                filters.category_id__in = selectedCategories.toString();
            }

            const data = await fetchArtworks(filters);
            console.log(data, 'hreee')
            setArtworks(data.objects);
            setTotalArtworks(data.total_count)
        } catch (error) {
            console.log(error);
        }
        setIsFetchingArtworks(false);
    }

    const getCategories = async () => {
        setIsFetchingCategories(true);
        setCategories([]);
        const filters = {}
        if (categorySearchKey.trim().length > 0) {
            filters['name__icontains'] = categorySearchKey;
        }
        try {
            const data = await fetchCategories(filters);
            setCategories(data.objects);
        } catch (error) {
            console.log(error);
        }
        setIsFetchingCategories(false);
    };

    const handleSearchKeyChange = useDebouncedCallback(() => {
        getArtworks();
    }, 500);

    const handleCattegorySearch = useDebouncedCallback(() => {
        getCategories();
    }, 500)

    const limitCategoryCount = (count) => {
        return count > 999 ? '1k+' : count;
    }

    useEffect(() => {
        if (paramSearchKey) {
            setSearchKey(paramSearchKey);
        }
        initializeArtworks();
    },[])

    useEffect(() => {
        handleSearchKeyChange();
    }, [searchKey, selectedCategories])

    useEffect(() => {
        handleCattegorySearch();
    }, [categorySearchKey])


    return (
        <div className='container xl mx-auto font-Adamina'>
            <div className='flex gap-3 mt-3 font-light'>
                <Link href='/'>Home</Link>
                <h3>/</h3>
                <Link href='/artworks' className='font-semibold' >Artworks</Link>
            </div>
            <div className='flex justify-between'>
                <div className='w-[15%]'>
                    <h3 className='text-2xl font-semibold mt-20 mb-2'>Category</h3>
                    <input onChange={(e) => {setCategorySearchKey(e.target.value)}} type="text" placeholder="Search category" className="input rounded-sm input-bordered w-full max-w-xs" />
                    <hr className="border-0 h-px bg-gray-300 my-3" />
                    <div className='flex flex-col gap-5'>
                    <div className="flex flex-col gap-2">
                        {isFetchingCategories && (
                            <>
                                {[...Array(6)].map((_, index) => (
                                    <div className="max-w-full overflow-x-hidden rounded-md" key={index}>
                                        <BaseLoading width={230} height={45} />
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                    {categories.map((category) => (
                        <div className='flex gap-3 items-center' key={category.id}>
                        <input
                            type='checkbox'
                            className='w-5 h-5 hover:cursor-pointer'
                            checked={selectedCategories.includes(category.id)}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    setSelectedCategories([...selectedCategories, category.id]);
                                } else {
                                    setSelectedCategories(selectedCategories.filter((cat) => cat !== category.id));
                                }
                            }}
                        />
                        <div className="flex items-center">
                            <h4 className='text-md tracking-widest'>{category.name}</h4>
                            <div className="badge">{limitCategoryCount(category.artwork_count)}</div>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                <div className='mt-5 pl-10 w-[85%]'>
                    <h1 className='text-3xl font-semibold'>ARTWORKS</h1>
                    <div className='flex flex-wrap gap-x-5 gap-y-3 items-center mt-2'>
                        <div className='bg-gray-200 py-3.5 flex rounded-sm w-96 h-[52px]'>
                            <div className='px-4'>
                                <FontAwesomeIcon icon={faMagnifyingGlass} width={20} height={20} />
                            </div>
                            <input
                                className='focus placeholder-gray-700 focus:outline-none bg-gray-200 w-96'
                                placeholder='Search Artwork or Artist...'
                                value={searchKey}
                                onChange={(event) => setSearchKey(event.target.value)}
                            />
                        </div>
                        <Link
                            href={'/artworks/new'}
                            className='btn btn-neutral text-xl rounded-sm font-normal h-[52px]'
                        >
                            <FontAwesomeIcon icon={faPaintbrush} width={20} height={20} />
                            Post Artwork
                        </Link>
                    </div>
                    <div className='mt-10 flex gap-5 flex-wrap'>
                    {isFetchingArtworks && (
                        <>
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className='flex flex-col gap-2'>
                                    <BaseLoading width={350} height={467} />
                                    <BaseLoading width={350} height={50} />
                                </div>
                            ))}
                        </>
                    )}
                    {artworks.map((item, index) => (
                        <ArtworkCard key={index} artwork={item} />
                    ))}
                    </div>
                    <div className="flex justify-center">
                        <div className="join">
                            <button className="join-item btn">1</button>
                            <button className="join-item btn btn-active">2</button>
                            <button className="join-item btn">3</button>
                            <button className="join-item btn">4</button>
                            <button className="join-item btn">»</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtworkPane;
