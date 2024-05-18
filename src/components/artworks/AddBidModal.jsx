'use client';

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

import { useBidStore } from '@/store/bid';
import { useAuthStore } from '@/store/auth';

function AddBidModal(props) {
    const {setShowAddBidModal, setShowBidsModal, artwork} = props;
    const artworkId = artwork.id;
    const { user } = useAuthStore();
    const { createBid, fetchBids } = useBidStore();
    const router = useRouter();

    const [isLoading, setIsloading] = useState(false);
    const [bidAmount, setBidAmount] = useState(0);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [highestBid, setHighestBid] = useState(null);
    const [amountErrorMsg, setAmountErrorMsg] = useState(null);

    const dateFormatter = (datetime) => {
        const date = new Date(datetime);
        return date.toDateString();
    }

    const validateAmount = () => {
        const amount = parseFloat(bidAmount);
        if (amount <= 0) {
            setAmountErrorMsg('Amount should be higher than 0');
            return false;
        } else if (highestBid) {
            if (amount <= highestBid.bid_amount) {
                setAmountErrorMsg('Amount should be higher than the highest bid');
                return false;
            }
        } else if (artwork.starting_bid) {
            if (amount < artwork.starting_bid) {
                setAmountErrorMsg('Starting bid is ₱' + artwork.starting_bid);
                return false;
            }
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true);
        if (!validateAmount()) {
            setIsloading(false);
            return;
        }
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

    const getHighestBid = async () => {
        setIsloading(true);
        try {
            const filters = {
                artwork_id: artworkId,
            }
            const data = await fetchBids(filters);
            if (data.length > 0) {
                setHighestBid(data[0]);
            }
            setIsloading(false);
        } catch (e) {
            console.error(e);
            router.push(`/artworks/${artworkId}`);
        }
    }

    useEffect(() => {
        getHighestBid();
    }, [])

    return (
        <form onSubmit={handleSubmit} className='fixed inset-0 flex justify-center items-center bg-black/[.5] z-20 font-Adamina'>
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

                            {highestBid ? (
                                <>
                                <h3>Highest bid</h3>
                                <div 
                                    className="border border-black/[.3] rounded-md w-full px-2 py-1 flex justify-between items-center bg-black text-white">
                                    <div className='flex flex-col gap-2'>
                                        <h3 className='font-bold'>{user.id !== highestBid.user.id? (highestBid.is_anonymous? 'Anonymous' : highestBid.user.username): 'You'}</h3>
                                        <p className='text-xs'>{dateFormatter(highestBid.bid_on)}</p>
                                    </div>
                                    <h3 className='font-bold'>₱{highestBid.bid_amount}</h3>
                                </div>
                                </>
                            ): (
                                <div>
                                    <h3>Starting bid: ₱{artwork.starting_bid || 0}</h3>
                                </div>
                            )}

                            <div>
                                <div class="label">
                                    <span class="label-text text-md font-bold">
                                        Amount
                                    </span>
                                </div>
                                <label className="input input-bordered flex items-center gap-2 rounded-md">
                                    ₱
                                    <input onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSubmit(e)
                                        }
                                    }} onChange={(e) => setBidAmount(e.target.value)} type="text" className="grow"
                                        placeholder={highestBid?.bid_amount || artwork.starting_bid || "0.00"} />
                                </label>
                                {amountErrorMsg && (
                                    <p className="text-error text-xs ml-2 mt-2">{amountErrorMsg}</p>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-2">
                                    <input onChange={(e) => setIsAnonymous(e.target.value)} type="checkbox" className="checkbox" />
                                    <span className="label-text">Bid Anonymously</span> 
                                </label>
                            </div>

                        </div>
                        )}
                        <div className="w-full px-3">
                            <button type="submit" className="btn btn-neutral mb-5 w-full">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default AddBidModal