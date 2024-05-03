"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'   
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDebouncedCallback } from 'use-debounce';

import ArtworkCard from '@/components/artworks/ArtworkCard';

import { useArtworkStore } from '@/store/artwork';


const ArtworkPane = () => {
    const { fetchArtworks, fetchCategories } = useArtworkStore();

    const searchParams = useSearchParams()
    const paramSearchKey = searchParams.get('search');

    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingArtworks, setIsFetchingArtworks] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [artworks, setArtworks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categorySearchKey, setCategorySearchKey] = useState('')

    const initializeArtworks = async () => {
        setIsLoading(true);
        await getArtworks();
        await getCategories();
        setIsLoading(false);
    };

    const getArtworks = async () => {
        setIsFetchingArtworks(true);
        try {
            const filters = {};
            if (searchKey.trim().length > 0) {
                filters.title__icontains = searchKey;
            }
            if (selectedCategories.length > 0) {
                filters.category_id__in = selectedCategories.toString();
            }

            const data = await fetchArtworks(filters);
            console.log(data, 'hreee')
            setArtworks(data.objects);
        } catch (error) {
            console.log(error);
        }
        setIsFetchingArtworks(false);
    }

    const getCategories = async () => {
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
    };

    const handleSearchKeyChange = useDebouncedCallback(() => {
        getArtworks();
    }, 500);

    const handleCattegorySearch = useDebouncedCallback(() => {
        getCategories();
    }, 500)

    const limitCategoryCount = (count) => {
        return count > 99 ? '99+' : count;
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
        <div className='container xl mx-auto'>
            <div className='flex gap-3 mt-3 font-light'>
                <h3>Home</h3>
                <h3>/</h3>
                <h3 className='font-semibold'>Artworks</h3>
            </div>
            <div className='flex justify-between'>
                <div className='w-[15%]'>
                    <h3 className='text-2xl font-semibold mt-20 mb-2'>Category</h3>
                    <input onChange={(e) => {setCategorySearchKey(e.target.value)}} type="text" placeholder="Search category" className="input rounded-sm input-bordered w-full max-w-xs" />
                    <hr className="border-0 h-px bg-gray-300 my-3" />
                    <div className='flex flex-col gap-5'>
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
                    <div className='bg-gray-200 py-3.5 flex rounded mt-2 w-96'>
                        <div className='px-4'>
                            <FontAwesomeIcon icon={faMagnifyingGlass} width={20} height={20} />
                        </div>
                        <input
                            className='focus placeholder-gray-700 focus:outline-none bg-gray-200 w-96'
                            placeholder='Search Artwork'
                            value={searchKey}
                            onChange={(event) => setSearchKey(event.target.value)}
                        />
                    </div>
                    <div className='mt-10 flex gap-5 flex-wrap'>
                    {artworks.map((item, index) => (
                        <ArtworkCard key={index} artwork={item} />
                    ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtworkPane;
