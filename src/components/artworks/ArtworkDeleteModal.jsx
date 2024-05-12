import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function ArtworkDeleteModal(params) {
    const { setShowDeleteModal, deleteArtwork, message } = params
    return (
        <div className='fixed inset-0 flex justify-center items-center bg-black/[.7] z-20'>
            <div className='flex flex-col gap-5 bg-black/[.7] px-5 py-3 rounded-md shadow-md w-[350px]'>
                <h1 className='text-xl font-medium text-white'>{message || 'Are you sure you want to delete this artwork?'}</h1>
                <div className='flex gap-3 mt-5 self-end'>
                    <button onClick={() => setShowDeleteModal(false)} className='btn px-3 py-1 rounded-md'>Cancel</button>
                    <button
                        onClick={deleteArtwork}
                        className='btn btn-error text-white px-3 py-1 rounded-md flex items-center'
                    >
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ArtworkDeleteModal