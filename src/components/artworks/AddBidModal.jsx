'use client';

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import { useBidStore } from '@/store/bid';
import { useAuthStore } from '@/store/auth';

function AddBidModal(params) {
    const {setShowAddBidModal, setShowBidsModal, artworkId} = params;
    const { user } = useAuthStore();
    const { createBid } = useBidStore();

    const [isLoading, setIsloading] = useState(false);
    const [bidAmount, setBidAmount] = useState(0);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const handleSubmit = async () => {
        setIsloading(true);
        const data = {
            bid_amount: parseFloat(bidAmount),
            is_anonymous: isAnonymous,
            user_id: user.id,
            artwork_id: artworkId,
        }
        try {
            await createBid(data);
            setShowAddBidModal(false);
            setShowBidsModal(true);
        } catch (e) {
            alert(e);
        }
        setIsloading(false);
    }

    return (
        <div className='fixed inset-0 flex justify-center items-center bg-black/[.5] z-20 font-Adamina'>
            <div className="mockup-phone mx-3">
                <div className="camera"></div> 
                <div className="display">
                    <div className="artboard artboard-demo phone-1 justify-start">
                        <div className='flex justify-between w-full px-5 py-3 items-center flex-row-reverse'>
                            <FontAwesomeIcon onClick={() => setShowAddBidModal(false)} className='cursor-pointer' icon={faClose} width={15} height={15} />
                            <button
                                onClick={() => {
                                    setShowBidsModal(true);
                                    setShowAddBidModal(false);
                                }}
                                className="badge badge-success text-white text-sm">
                                all
                            </button>
                        </div>
                        {isLoading ? (
                            <div className="grow w-full flex flex-col justify-center items-center">
                                <span className="loading loading-infinity loading-lg text-blue-400"></span>
                            </div>
                        ):(
                        <div className='grow w-full px-2 pt-3 flex flex-col gap-3 overflow-y-auto'>
                            <h1 className='text-xl font-bold text-center'>Add a bid</h1>
                            <div>
                                <div class="label">
                                    <span class="label-text text-md font-bold">
                                        Amount
                                    </span>
                                </div>
                                <label className="input input-bordered flex items-center gap-2 rounded-md">
                                    ₱
                                    <input onChange={(e) => setBidAmount(e.target.value)} type="text" className="grow" placeholder="0.00" />
                                </label>    
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-2">
                                    <input onChange={(e) => setIsAnonymous(e.target.value)} type="checkbox" className="checkbox" />
                                    <span className="label-text">Bid Anonymously</span> 
                                </label>
                            </div>

                        </div>
                        )}
                        <button onClick={handleSubmit} className="btn btn-neutral w-full mb-5 w-[80%]">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddBidModal