'use client';

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

import { useAuthStore } from '@/store/auth';

function NewArtworkPane() {
    const router = useRouter();
    const { user } = useAuthStore();
    const pathname = usePathname();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!user) {
            router.push(`/login?redirect=${pathname}`)
        }
    }, [])

    useEffect(() => {
        console.log(description);
    }, [description]);

    return (
        <main className='font-Adamina container mx-auto my-5'>
            <h1 className='text-center font-bold text-3xl mb-5'>New Artwork</h1>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                    <pre className='font-Adamina'>
                        {description}
                    </pre>
                </div>
                <div className='flex flex-col gap-3'>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text text-xl font-bold">Title</span>
                        </div>
                        <input type="text" placeholder="Title" class="input input-bordered w-full rounded-sm" />
                    </label>
                    
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text text-xl font-bold">Description</span>
                        </div>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            class="textarea textarea-bordered" placeholder="Description"
                        ></textarea>
                    </label>
                </div>
            </div>
        </main>
    )
}

export default NewArtworkPane