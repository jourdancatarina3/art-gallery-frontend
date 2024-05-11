import React from 'react'
import Navbar from '@/components/generics/navbar';
import Footer from '@/components/generics/Footer';
import EditArtworkPane from '@/components/artworks/EditArtworkPane';

function page({ params }) {
    const { id: slug } = params;
    
    const artworkId = slug.split('-').shift();
    return (
        <>
            <Navbar />
            <EditArtworkPane artworkId={artworkId} />
            <Footer />
        </>
    )
}

export default page