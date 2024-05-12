'use client';

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { useBidStore } from '@/store/bid';
import { useAuthStore } from '@/store/auth';
import ArtworkDeleteModal from './ArtworkDeleteModal';

function BidsModal(params) {
    const { setShowBidsModal, artworkId, setShowAddBidModal } = params;
    const { fetchBids, deleteBid } = useBidStore();
    const { user } = useAuthStore();

    const [isLoading, setIsloading] = useState(true);
    const [bids, setBids] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBidId, setSelectedBidId] = useState(null);

    const getBids = async () => {
        setIsloading(true);
        const filters = {
            artwork_id: artworkId
        }
        const data = await fetchBids(filters);
        setBids(data);
        setIsloading(false);
    }

    const removeBid = async () => {
        setShowDeleteModal(false);
        await deleteBid(selectedBidId);
        getBids();
    }

    const dateFormatter = (datetime) => {
        const date = new Date(datetime);
        return date.toDateString();
    }

    useEffect(() => {
        setBids([]);
        getBids();
    }, [])
    return (
        <div className='fixed inset-0 flex justify-center items-center bg-black/[.5] z-20 font-Adamina'>
            {showDeleteModal && (
                <ArtworkDeleteModal
                    setShowDeleteModal={setShowDeleteModal}
                    deleteArtwork={removeBid}
                    message="Are you sure you want to delete this bid?"
                />
            )}
            <div className="mockup-phone mx-3">
                <div className="camera"></div> 
                <div className="display">
                    <div className="artboard artboard-demo phone-1 justify-start">
                        <div className='flex justify-between w-full px-5 py-3 items-center'>
                        <button
                            onClick={() => {
                                setShowBidsModal(false);
                                setShowAddBidModal(true);
                            }}
                            className="badge badge-success text-white text-sm">add</button>
                            <FontAwesomeIcon onClick={() => setShowBidsModal(false)} className='cursor-pointer' icon={faClose} width={15} height={15} />
                        </div>
                        {isLoading ? (
                            <div className="grow w-full flex flex-col justify-center items-center">
                                <span className="loading loading-infinity loading-lg text-blue-400"></span>
                            </div>
                        ):(
                        <div className='grow w-full px-2 pt-3 flex flex-col gap-3 overflow-y-auto'>
                            {bids.map((bid, index) => (
                            <div key={bid.id}>
                                {user.id === bid.user.id && (
                                <div className='relative flex justify-end'>
                                    <button
                                        onClick={() => {
                                            setSelectedBidId(bid.id);
                                            setShowDeleteModal(true);
                                        }} 
                                        className='absolute translate-y-[-50%]'>
                                        <FontAwesomeIcon icon={faTrash} className='text-error' />
                                    </button>
                                </div>
                                )}
                                <div 
                                    className={`border border-black/[.3] rounded-md w-full px-2 py-1 flex justify-between items-center
                                    ${index === 0 && 'bg-black text-white'}`}>
                                    <div className='flex flex-col gap-2'>
                                        <h3 className='font-bold'>{user.id !== bid.user.id? bid.user.username: 'You'}</h3>
                                        <p className='text-xs'>{dateFormatter(bid.bid_on)}</p>
                                    </div>
                                    <h3 className='font-bold'>₱{bid.bid_amount}</h3>
                                </div>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BidsModal