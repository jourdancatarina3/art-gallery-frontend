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
    const paramTop = searchParams.get('top') || 0;

    const [top, setTop] = useState(parseInt(paramTop) || 0)
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingArtworks, setIsFetchingArtworks] = useState(false);
    const [isFetchingCategories, setIsFetchingCategories] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [artworks, setArtworks] = useState([]);
    const [totalArtworks, setTotalArtworks] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categorySearchKey, setCategorySearchKey] = useState('');
    const [finishedInitialFetch, setFinishedInitialFetch] = useState(false);

    const pageCount = Math.ceil(totalArtworks / ARTWORK_SIZE_PER_REQUEST);
    const currentPage = Math.ceil(top + 1 / ARTWORK_SIZE_PER_REQUEST)

    const initializeArtworks = async () => {
        setIsLoading(true);
        await Promise.all([getArtworks(), getCategories()])
        setIsLoading(false);
        setFinishedInitialFetch(true);
    };

    const getArtworks = async (top=0) => {
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
        if (!finishedInitialFetch) return;
        handleSearchKeyChange();
    }, [searchKey, selectedCategories, handleSearchKeyChange])

    useEffect(() => {
        if (!finishedInitialFetch) return;
        handleCattegorySearch();
    }, [categorySearchKey, handleCattegorySearch])


    return (
        <div className='container xl overflow-x-hidden mx-auto font-Adamina'>
            <div className='flex gap-3 mt-3 font-light'>
                <Link href='/'>Home</Link>
                <h3>/</h3>
                <Link href='/artworks' className='font-semibold' >Artworks</Link>
            </div>
            <div className='flex gap-10 min-h-lvh'>   
                <div className='max-w-[200px] min-w-[200px]'>
                    <h3 className='text-2xl font-semibold mt-5 mb-2'>Category</h3>
                    <input onChange={(e) => {setCategorySearchKey(e.target.value)}} type="text" placeholder="Search category" className="input rounded-sm input-bordered w-full max-w-xs" />
                    <hr className="border-0 h-px bg-gray-300 my-3" />
                    <div className='flex flex-col gap-5'>
                    <div className="flex flex-col gap-1">
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
                                id={category.id}
                                type='checkbox'
                                className='checkbox checkbox-sm rounded-sm hover:cursor-pointer'
                                checked={selectedCategories.includes(category.id)}
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        setSelectedCategories([...selectedCategories, category.id]);
                                    } else {
                                        setSelectedCategories(selectedCategories.filter((cat) => cat !== category.id));
                                    }
                                }}
                            />
                            <label className="flex items-center cursor-pointer" for={category.id}>
                                <h4 className='text-md tracking-widest max-w-[150px] truncate'>{category.name}</h4>
                                <div className="badge">{limitCategoryCount(category.artwork_count)}</div>
                            </label>
                        </div>
                    ))}
                    </div>
                </div>
                <div className='mt-5 grow'>
                    <h1 className='text-3xl font-semibold'>ARTWORKS</h1>
                    <div className='flex flex-wrap gap-x-5 gap-y-3 items-center mt-2'>
                        <div className='bg-gray-200 py-3.5 flex rounded-sm w-[50%] h-[52px]'>
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
                        {pageCount > 1 && (
                        <div className="join">
                            {Math.ceil(currentPage / ARTWORK_SIZE_PER_REQUEST) !== 1 && (
                                <button className="join-item btn">«</button>
                            )}
                            {[...Array(pageCount)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`join-item btn ${Math.ceil(currentPage / ARTWORK_SIZE_PER_REQUEST) === index + 1 ? 'btn-active' : ''}`}
                                    onClick={() => {
                                        console.log(index * ARTWORK_SIZE_PER_REQUEST, 'heree')
                                        getArtworks(index * ARTWORK_SIZE_PER_REQUEST);
                                        setTop(index * ARTWORK_SIZE_PER_REQUEST)
                                    }}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            {Math.ceil(currentPage / ARTWORK_SIZE_PER_REQUEST) !== pageCount && (
                                <button className="join-item btn">»</button>
                            )}
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtworkPane;
