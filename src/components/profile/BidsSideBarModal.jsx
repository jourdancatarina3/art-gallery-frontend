'use client';

import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

function BidsSideBarModal(props) {
    const { bids, close } = props;
    const [isVisible, setIsVisible] = useState(true);

    const dateFormatter = (datetime) => {
        const date = new Date(datetime);
        return date.toDateString();
    }

    return (
        <div className="relative">
            <div className={`slide-in-bids flex flex-col gap-2 h-full w-[300px] min-w-[300px] translate-x-[-100%] bg-white py-5 px-2 custom-left-shadow absolute
                            ${!isVisible ? 'slide-out-bids': ''}`}>
                <h2 className='font-bold text-xl border-dashed border-b border-black/[.3] pb-3 flex justify-between items-center'>
                    Bids
                    <FontAwesomeIcon onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => {
                            close();
                        }, 100);
                    }} className='cursor-pointer' icon={faClose} width={15} height={15} />
                </h2>
                <div className=" grow flex flex-col gap-2 overflow-y-auto">
                    {bids.map((bid, index) => (
                    <div key={bid.id}>
                        <div 
                            className='border bg-white border-black/[.3] rounded-md w-full px-2 py-1 flex justify-between items-center'>
                            <div className='flex flex-col gap-2'>
                                <Link href={`/artworks/${bid.artwork.slug}?prev=true`} className='font-bold hover:underline'>{bid.artwork.title}</Link>
                                <p className='text-xs'>{dateFormatter(bid.bid_on)}</p>
                            </div>
                            <h3 className='font-bold'>₱{bid.bid_amount}</h3>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BidsSideBarModal