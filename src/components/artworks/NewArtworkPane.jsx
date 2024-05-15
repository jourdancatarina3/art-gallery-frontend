'use client';

import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

import { useAuthStore } from '@/store/auth';
import { useArtworkStore } from '@/store/artwork';
import { useCloudinaryStore } from '@/store/cloudinary';
import FullLoader from '../generics/FullLoader';

function NewArtworkPane() {
    const router = useRouter();
    const { user, getUser } = useAuthStore();
    const { fetchCategories, createCategory, createArtwork } = useArtworkStore();
    const { uploadImage, deleteImage } = useCloudinaryStore();
    const pathname = usePathname();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(0);
    const [price, setPrice] = useState(null);
    const [category, setCategory] = useState('');
    const [categoryId, setCategoryId] = useState(null);
    const [categoryList, setCategoryList] = useState([]);
    const [isFetchingCategories, setIsFetchingCategories] = useState(false);
    const [categorySearchKey, setCategorySearchKey] = useState('');
    const [showCreateNewCategory, setShowCreateNewCategory] = useState(false);
    const [focusCategorySearch, setFocusCategorySearch] = useState(false);
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [imagesUrl, setImagesUrl] = useState([
    ]);
    const [isUploading, setIsUploading] = useState(false);
    const [createdArtwork, setCreatedArtwork] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const imageInputRef = useRef();

    const triggerUpload = () => {
        imageInputRef.current.click();
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (imagesUrl.length >= 5) {
            alert('You can only upload up to 5 images');
            return;
        }
        if (isUploading) return;
        if (!file || !file.type.includes('image')) {
            alert('Invalid file type');
            return;
        }
        setIsUploading(true);
        const data = {
            file: file,
            width: 600,
            height: 800,
            cover: 'fill',
            folder: 'artworks'
        }
        uploadImage(data).then((res) => {
            setImagesUrl([...imagesUrl, res.url]);
            setIsUploading(false);
        }).catch((error) => {
            console.log(error);
            setIsUploading(false);
        })
    }

    const removeImage = (index, url) => {
        deleteImage(url, 'faso/artworks/').then((res) => {
            console.log(res);
        }).catch((e) => {
            console.error(e);
        })
        const temp = imagesUrl;
        temp.splice(index, 1);
        setImagesUrl([...temp]);
    }

    const limitCategoryCount = (count) => {
        return count > 999 ? '1k+' : count;
    }

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const data = {
                artist_id: user.id,
                category_id: categoryId === -1 ? null : categoryId,
                title: title,
                description: description,
                status: status,
                image_urls: imagesUrl
            }
            if (status === 0){
                data['starting_bid'] = parseFloat(price);
            } else{
                data['sold_price'] = parseFloat(price);
            }
            const res = await createArtwork(data);
            setCreatedArtwork(true);
            console.log(res, 'res');
            router.push(`/artworks/${res.artwork.slug}`);
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }

    const createNewCategory = () => {
        setIsCreatingCategory(true);
        if (categorySearchKey.trim().length === 0) return;
        createCategory(categorySearchKey.trim()).then((res) => {
            setCategory(res.name);
            setCategoryId(res.id);
            setIsCreatingCategory(false);
        })
    }

    const getCategories = async () => {
        setIsFetchingCategories(true);
        setCategoryList([]);
        const filters = {}
        if (categorySearchKey.trim().length > 0) {
            filters['name__icontains'] = categorySearchKey.trim();
        }
        try {
            const data = await fetchCategories(filters);
            setCategoryList(data.objects);
            if (data.total_count === 0) {
                setShowCreateNewCategory(true);
            } else {
                setShowCreateNewCategory(false);
            }
        } catch (error) {
            console.log(error);
        }
        setIsFetchingCategories(false);
    };

    const handleCattegorySearch = useDebouncedCallback(() => {
        getCategories();
    }, 500);

    const checkUserLogin = async () => {
        if (!user) {
            await getUser().then((res) => {
                if (!res) {
                    router.push(`/login?redirect=${pathname}`);
                }
            })
        }
    }

    useEffect(() => {
        checkUserLogin();
        getCategories();
    }, [])

    useEffect(() => {
        handleCattegorySearch();
    }, [categorySearchKey]);

    return (
        <main className='font-Adamina container mx-auto my-5 min-h-lvh'>
            {isLoading && <FullLoader />}
            <div className="flex flex-wrap justify-between items-center mb-5 px-3 gap-3">    
                <FontAwesomeIcon
                    onClick={() => router.back()} icon={faClose}
                    className='text-3xl h-[30px] cursor-pointer'
                />
                <h1 className='font-bold text-xl sm:text-3xl'>New Artwork</h1>
                <button
                    onClick={handleSave}
                    className="btn btn-neutral text-base rounded-sm sm:text-lg"
                >
                    Post
                </button>
            </div>
            <div className="divider"></div> 
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className='flex flex-col p-5'>
                    <h2 className="text-xl font-bold mb-3">Images</h2>
                    <input type="file" accept="image/*" ref={imageInputRef} className="hidden" onChange={handleFileChange}/>
                    {imagesUrl.length === 0 && (
                    <button
                        disabled={isUploading}
                        onClick={triggerUpload}
                        className={`flex justify-center items-center border-dashed border-2 border-sky-300 w-full text-sky-300
                            h-[400px] rounded ${isUploading? 'cursor-not-allowed': ''} hover:bg-sky-100 transition duration-100`}
                    >
                        {!isUploading ? (
                            <div className="text-xl flex flex-col gap-3 items-center">
                                <FontAwesomeIcon icon={faPlus} width={30} height={30} />
                                Add Image
                            </div>
                        ): (
                            <span className="loading loading-infinity loading-lg"></span>
                        )}
                    </button>
                    )}

                    {imagesUrl.length > 0 && (
                        <div className="mt-5 flex justify-center flex-wrap gap-5">
                            {imagesUrl.map((url, index) => (
                                <div key={index} className='flex'>
                                    <div className="relative h-[200px] w-[150px]">
                                        <Image src={url} layout="fill" objectFit="cover" className="rounded-sm" />
                                    </div>
                                    <div className="relative">
                                        <button className="absolute z-10 translate-x-[-100%] p-1">
                                            <FontAwesomeIcon
                                                onClick={() => {removeImage(index, url)}}
                                                className='text-error shadow-md' icon={faTrash} width={20} height={20}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                disabled={isUploading}
                                onClick={triggerUpload}
                                className={`relative h-[200px] w-[150px] flex justify-center items-center border-dashed border-2 text-sky-300
                                    border-sky-300 rounded ${isUploading? 'cursor-not-allowed': ''} hover:bg-sky-100 transition duration-100`}
                            >
                                {!isUploading ? (
                                    <FontAwesomeIcon className='' icon={faPlus} />
                                ): (
                                    <span className="loading loading-infinity loading-md"></span>
                                )}
                            </button>
                        </div>
                    )}
                </div>
                <div className='flex flex-col gap-3 p-5'>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text text-xl font-bold">Title</span>
                        </div>
                        <input
                            onChange={(e) => setTitle(e.target.value)}
                            type="text" placeholder="Artwork title" class="input input-bordered w-full rounded-sm"
                        />
                    </label>
                    
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text text-xl font-bold">Description</span>
                        </div>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            class="textarea textarea-bordered rounded-sm h-[400px]" placeholder="Description"
                        ></textarea>
                    </label>
                    
                    <div className='my-2'>
                        <h2 className="text-xl font-bold mb-2">Status</h2>
                        <div className="flex w-full">
                            <a
                                onClick={() => {setStatus(0)}}
                                className={`btn text-lg grid h-20 flex-grow card rounded-sm place-items-center
                                ${status === 0 && 'btn-neutral'}
                                `}
                            >
                                For sale
                            </a>
                            <div className="divider divider-horizontal">OR</div>
                            <a
                                onClick={() => {setStatus(2)}}
                                className={`btn text-lg grid h-20 flex-grow card rounded-sm place-items-center
                                ${status === 2 && 'btn-neutral'}
                                `}
                            >
                                Sold
                            </a>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className='w-[50%]'>
                            <label class="form-control">
                                <div class="label">
                                    <span class="label-text text-xl font-bold">Category</span>
                                </div>

                                {categoryId !== null && (
                                <div className='border rounded-sm px-4 py-2 flex gap-3 items-center w-min'>
                                    <p className='text-md font-bold w-max'>{category}</p>
                                    <button>
                                        <FontAwesomeIcon icon={faCircleXmark} onClick={() => {setCategory(''); setCategoryId(null)}} />
                                    </button>
                                </div>
                                )}

                                {categoryId === null && (
                                    <label class="input input-bordered flex items-center gap-2 rounded-sm">
                                        <input
                                            onChange={(e) => setCategorySearchKey(e.target.value)}
                                            onFocus={() => setFocusCategorySearch(true)}
                                            type="text" className="grow" placeholder="Search Category"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
                                    </label>
                                )
                                }
                            </label>

                            <div className="relative">
                            {(focusCategorySearch || categorySearchKey.trim().length > 0 ) && categoryId === null && (
                                (
                                    <div className='absolute z-10 mt-1 flex flex-col bg-white gap-3 py-3 px-5 w-full max-h-[400px] border rounded-sm shadow-md overflow-y-auto'>
                                        {isFetchingCategories && (
                                            <span className="loading loading-dots loading-lg"></span>
                                        )}
                                        {categorySearchKey.trim().length === 0 && (
                                            <button
                                                onClick={() => {
                                                    setCategory("None");
                                                    setCategoryId(-1);
                                                }}
                                                className='text-start font-bold'>
                                                Skip
                                            </button>
                                        )}
                                        {categoryList.map((category) => {
                                            return (
                                                <div className='flex items-center gap-2' key={category.id}>
                                                    <button
                                                        onClick={() => {
                                                            setCategory(category.name);
                                                            setCategoryId(category.id);
                                                        }}
                                                        className='text-start truncate'>
                                                        {category.name}
                                                    </button>
                                                    <div className="badge text-white bg-neutral">{limitCategoryCount(category.artwork_count)}</div>
                                                </div>
                                            )
                                        })}
                                        {showCreateNewCategory && (
                                            <button
                                                onClick={createNewCategory}
                                                className='btn btn-neutral font-normal'
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                                {!isCreatingCategory ? 'Create New Category' : 'Creating Category...'}
                                            </button>
                                        
                                        )}
                                    </div>
                                )
                            )}
                            </div>
                        </div>

                        <div className='w-[50%]'>
                            {status !== null && (
                            <label class="form-control w-full">
                                <div class="label">
                                    <span class="label-text text-xl font-bold">
                                        {status === 0 ? 'Starting Bid' : 'Sold Price'}
                                    </span>
                                </div>
                                <label className="input input-bordered flex items-center gap-2 rounded-sm">
                                    ₱
                                    <input onChange={(e) => setPrice(e.target.value)} type="text" className="grow" placeholder="0.00" />
                                </label>
                            </label>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default NewArtworkPane