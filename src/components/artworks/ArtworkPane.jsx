"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'   
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Icon from '@mdi/react';
import { mdiFilterVariant } from '@mdi/js';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { CSSTransition } from 'react-transition-group';
import '@/styles/ArtworkPane.scss';

import ArtworkCard from '@/components/artworks/ArtworkCard';
import BaseLoading from '@/components/generics/BaseLoading';

import { useArtworkStore } from '@/store/artwork';
import { useAuthStore } from '@/store/auth';

const ARTWORK_SIZE_PER_REQUEST = 21;

const ArtworkPane = () => {
    const { fetchArtworks, fetchCategories } = useArtworkStore();
    const { user, defaultAvatarUrl } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams()
    const paramSearchKey = searchParams.get('search');
    const paramTop = searchParams.get('top') || 0;

    const [top, setTop] = useState(parseInt(paramTop) || 0)
    const [isFetchingArtworks, setIsFetchingArtworks] = useState(false);
    const [isFetchingCategories, setIsFetchingCategories] = useState(false);
    const [searchKey, setSearchKey] = useState(paramSearchKey || '');
    const [artworks, setArtworks] = useState([]);
    const [totalArtworks, setTotalArtworks] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categorySearchKey, setCategorySearchKey] = useState('');
    const [finishedInitialFetch, setFinishedInitialFetch] = useState(false);
    const [showCategories, setShowCategories] = useState(true);

    const pageCount = Math.ceil(totalArtworks / ARTWORK_SIZE_PER_REQUEST);
    const currentPage = Math.ceil(top + 1 / ARTWORK_SIZE_PER_REQUEST)

    const initializeArtworks = async () => {
        await Promise.all([getArtworks(), getCategories()])
        setFinishedInitialFetch(true);
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
        router.push(`${pathname}?top=0&search=${searchKey}`)
        setTop(0);
        handleSearchKeyChange();
    }, [searchKey, selectedCategories, handleSearchKeyChange])

    useEffect(() => {
        if (!finishedInitialFetch) return;
        handleCattegorySearch();
    }, [categorySearchKey, handleCattegorySearch])

    useEffect(() => {
        if (!finishedInitialFetch) return;
        router.push(`${pathname}?top=${top}`)
        getArtworks();
    }, [top])


    return (
        <div className='container xl overflow-hidden mx-auto font-Adamina'>
            <div className='flex gap-3 mt-3 font-light'>
                <Link href='/'>Home</Link>
                <h3>/</h3>
                <Link href='/artworks' className='font-semibold' >Artworks</Link>
            </div>
            <div className='flex gap-5 min-h-lvh'>
                <CSSTransition
                    in={showCategories}
                    timeout={300}
                    classNames="category"
                    unmountOnExit
                >
                    <div className='max-w-[240px] min-w-[240px] px-3 bg-black/[.02] border-r border-black/[.1]'>
                        <h3 className='text-2xl font-semibold mt-5 mb-2'>
                            Top Categories
                        </h3>
                        <input onChange={(e) => {setCategorySearchKey(e.target.value)}} type="text" placeholder="Search category" className="input rounded-sm input-bordered w-full max-w-xs" />
                        <hr className="border-0 h-px bg-gray-300 my-3" />
                        <div className='flex flex-col gap-5'>
                        <div className="flex flex-col gap-1">
                            {isFetchingCategories && (
                                <>
                                    {[...Array(6)].map((_, index) => (
                                        <div className="max-w-full overflow-hidden rounded-md" key={index}>
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
                                    <h4 className='text-md tracking-widest max-w-[120px] truncate'>{category.name}</h4>
                                    <div className="badge">{limitCategoryCount(category.artwork_count)}</div>
                                </label>
                            </div>
                        ))}
                        </div>
                    </div>
                </CSSTransition>

                <div className='mt-5 grow'>
                    <h1 className='text-3xl font-semibold'>ARTWORKS</h1>
                    <div className='flex flex-wrap gap-x-3 gap-y-3 items-center mt-2'>
                        <label className="input input-bordered flex bg-black/[.02] rounded-sm items-center gap-2 w-[50%]">
                            <input
                                value={searchKey}
                                onChange={(event) => setSearchKey(event.target.value)}
                                type="text" className="grow" placeholder="Search Artwork or Artist..." />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                        </label>

                        <Link
                            href={'/artworks/new'}
                            className='btn btn-neutral text-xl rounded-sm font-normal h-[52px]'
                        >
                            <FontAwesomeIcon icon={faPlus} width={20} height={20} />
                            Add Artwork
                        </Link>
                        <button
                            onClick={() => setShowCategories(!showCategories)}
                            className='btn rounded-sm'
                        >
                            <Icon path={mdiFilterVariant} size={1} color='currentColor' />
                        </button>
                    </div>
                    <div className='mt-10 flex gap-5 flex-wrap'>
                    {isFetchingArtworks && (
                        <>
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className='flex flex-col gap-2'>
                                    <BaseLoading width={300} height={400} />
                                    <BaseLoading width={300} height={50} />
                                </div>
                            ))}
                        </>
                    )}
                    {artworks.map((item, index) => (
                        <ArtworkCard key={index} artwork={item} />
                    ))}
                    </div>
                    <div className="flex justify-center mt-5">
                        {pageCount > 1 && (
                        <div className="join">
                            {Math.ceil(currentPage / ARTWORK_SIZE_PER_REQUEST) !== 1 && (
                                <button
                                    onClick={() => {
                                        setTop(top - ARTWORK_SIZE_PER_REQUEST)
                                    }}
                                    className="join-item btn"
                                >«</button>
                            )}
                            {[...Array(pageCount)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`join-item btn ${Math.ceil(currentPage / ARTWORK_SIZE_PER_REQUEST) === index + 1 ? 'btn-active' : ''}`}
                                    onClick={() => {
                                        setTop(index * ARTWORK_SIZE_PER_REQUEST)
                                    }}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            {Math.ceil(currentPage / ARTWORK_SIZE_PER_REQUEST) !== pageCount && (
                                <button
                                    onClick={() => {
                                        setTop(top + ARTWORK_SIZE_PER_REQUEST)
                                    }}
                                    className="join-item btn"
                                >»</button>
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
