'use client';

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

import { useAuthStore } from '@/store/auth';
import { useArtworkStore } from '@/store/artwork';

function NewArtworkPane() {
    const router = useRouter();
    const { user, getUser } = useAuthStore();
    const { fetchCategories, createCategory } = useArtworkStore();
    const pathname = usePathname();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categoryId, setCategoryId] = useState(null);
    const [categoryList, setCategoryList] = useState([]);
    const [isFetchingCategories, setIsFetchingCategories] = useState(false);
    const [categorySearchKey, setCategorySearchKey] = useState('');
    const [showCreateNewCategory, setShowCreateNewCategory] = useState(false);
    const [focusCategorySearch, setFocusCategorySearch] = useState(false);
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [imagesUrl, setImagesUrl] = useState([
        'https://img.freepik.com/free-vector/watercolor-chinese-style-background_52683-96106.jpg?t=st=1714461089~exp=1714464689~hmac=0ec0a2ce896216278394e5252ef09a0083a7d4b9945b68336c3c35083b48e41f&w=740',
        'https://img.freepik.com/free-vector/watercolor-chinese-style-background_52683-96106.jpg?t=st=1714461089~exp=1714464689~hmac=0ec0a2ce896216278394e5252ef09a0083a7d4b9945b68336c3c35083b48e41f&w=740',
        'https://img.freepik.com/free-vector/watercolor-chinese-style-background_52683-96106.jpg?t=st=1714461089~exp=1714464689~hmac=0ec0a2ce896216278394e5252ef09a0083a7d4b9945b68336c3c35083b48e41f&w=740',
        'https://img.freepik.com/free-vector/watercolor-chinese-style-background_52683-96106.jpg?t=st=1714461089~exp=1714464689~hmac=0ec0a2ce896216278394e5252ef09a0083a7d4b9945b68336c3c35083b48e41f&w=740',
    ]);

    const limitCategoryCount = (count) => {
        return count > 999 ? '1k+' : count;
    }

    const handleSave = () => {
        console.log('Save')
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
        <main className='font-Adamina container mx-auto my-5'>
            <h1 className='text-center font-bold text-3xl mb-5'>New Artwork</h1>
            <div className="divider"></div> 
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className='flex flex-col p-5'>
                    <h2 className="text-xl font-bold mb-3">Images</h2>
                    <button className="flex justify-center items-center border-dashed border-2 border-sky-300 w-full h-[400px] rounded hover:bg-sky-100 transition duration-100">
                        <p className="text-xl text-sky-300">Upload Image</p>
                    </button>

                    {imagesUrl.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-5">
                            {imagesUrl.map((url, index) => (
                                <div key={index} className='flex'>
                                    <div className="relative h-[200px] w-[150px]">
                                        <Image src={url} layout="fill" objectFit="cover" className="rounded-sm" />
                                    </div>
                                    <div className="relative">
                                        <button className="absolute z-10 translate-x-[-100%] p-1">
                                            <FontAwesomeIcon
                                                onClick={() => {
                                                    const temp = imagesUrl;
                                                    temp.splice(index, 1);
                                                    setImagesUrl([...temp]);
                                                }}
                                                className='text-error shadow-md' icon={faTrash} width={20} height={20}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
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
                            type="text" placeholder="Title" class="input input-bordered w-full rounded-sm"
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
                    
                    <label class="form-control w-full">
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
                            <label class="input input-bordered flex items-center gap-2">
                                <input
                                    onChange={(e) => setCategorySearchKey(e.target.value)}
                                    onFocus={() => setFocusCategorySearch(true)}
                                    type="text" class="grow" placeholder="Search Category"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
                            </label>
                        )
                        }
                    </label>
                    <div className="relative">
                    {(focusCategorySearch || categorySearchKey.trim().length > 0 ) && categoryId === null && (
                        (
                            <div className='absolute flex flex-col gap-3 py-3 px-5 w-full max-h-[400px] border rounded-sm shadow-md overflow-y-auto'>
                                {isFetchingCategories && (
                                    <span className="loading loading-dots loading-lg"></span>
                                )}
                                {categorySearchKey.trim().length === 0 && (
                                    <button
                                        onClick={() => {
                                            setCategory("None");
                                            setCategoryId(-1);
                                        }}
                                        className='text-start truncate'>
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
                    <div className="block flex justify-end gap-2 w-full">
                        <button
                            onClick={() => router.push('/artworks')}
                            className="btn btn-neutral rounded-sm w-[100px]"
                        >
                            Cancel
                        </button>  
                        <button
                            onClick={handleSave}
                            className="btn btn-active rounded-sm w-[100px]"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default NewArtworkPane